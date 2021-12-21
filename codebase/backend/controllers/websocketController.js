const { WebSocket } = require("ws");
const jwtConfig = require("../jwtConfig");
const { verifyUserWithoutResponse } = require("../middleware/auth");
const { initChat, sendMessage } = require("./chatController");
const mongoose = require("mongoose");

const handleAction = (ws, data, authData, ChatInstance, UserModel, connections) => {
    switch (data.type) {
        case "init":
            connections.add({token: data.token, webSocket: ws, userId: authData.id, expiry: authData.exp});
            initChat(ws, data, authData, ChatInstance, UserModel, connections);
            break;
        case "send":
            if (!data.to) {
                ws.send(JSON.stringify({
                    type: "send",
                    error: "Missing recepient."
                }));
                return;
            }
            if (!data.message) {
                ws.send(JSON.stringify({
                    type: "send",
                    error: "Missing message."
                }));
                return;
            }
            sendMessage(ws, data, authData, ChatInstance, UserModel, connections);
            break;
        default:
            ws.send(JSON.stringify({
                error: "Invalid request"
            }));
            break;
    }
}

const websocketServer = async (server, UserModel) => {
    const connections = new Set();
    const wss = new WebSocket.Server({ noServer: true, path: "/api/ws/connect" });
    const db = await mongoose.connect(process.env.MONGO_URI);
    const ChatInstance = await require('../models/ChatInstance')(db);

    server.on("upgrade", (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });

    setInterval(() => async () =>{
        console.log("Connections: ", connections.length);
        console.log(connections);
        // Remove expired connections
        connections.forEach(connection => {
            if (connection.expiry < Date.now()) {
                connection.webSocket.close();
                connections.delete(connection);
            }
        });
    }, 5000);

    wss.on('close', (ws) => {
        const connectionsToDelete = connections.filter(connection => connection.webSocket === ws);
        connectionsToDelete.forEach(connection => {
            connection.webSocket.close();
            connections.delete(connection);
        });
    });

    wss.on("connection", (ws) => {
        ws.on("message", (message) => {
            try {
                const dataStream = message.toString('utf8');
                const data = JSON.parse(dataStream);
                if (!data.token) {
                    ws.send(JSON.stringify({
                        error: "Token is missing"
                    }));
                    return;
                } else {
                    verifyUserWithoutResponse(data.token).then((authData) => {
                        if (authData === false) {
                            ws.send(JSON.stringify({
                                error: "Token is invalid"
                            }));
                            return;
                        } else {
                            if (data.type === "auth") {
                                ws.send(JSON.stringify({
                                    type: "auth",
                                    userId: authData.id,
                                    name: authData.firstName + " " + authData.lastName,
                                    message: "Authenticated"
                                }));
                            } else {
                                handleAction(ws, data, authData, ChatInstance, UserModel, connections);
                            }
                            return;
                        }
                    });
                }
            } catch (e) {
                console.log(e);
                ws.send(JSON.stringify({
                    error: "Invalid request"
                }));
                return;
            }
        });
    });

    return wss;
}

module.exports = websocketServer;