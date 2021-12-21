import { randomBytes } from "crypto";
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * UserTableRow is a row in UserTable
 */
type UserTableRow = {
  firstName: string;
  lastName: string;
};

/**
 * UserTable is a table of users.
 */
type UserTable = {
  [id: string]: UserTableRow;
};

/**
 * ChatInstance is a single chat instance between two users.
 */
type ChatInstance = {
  _id: string;
  personOne: string;
  personTwo: string;
  messages: [
    {
      sender: string;
      message: string;
      when: string;
    }
  ];
};

/**
 * Renders the chat system
 *
 * @param { match } route props
 * @returns { JSX.Element }
 */
const ChatSystem = ({ match }: any) => {
  const auth = useAuth();
  const authToken = auth.getAuthData().authToken;
  const authData = auth.getAuthData().authData;
  const [webSocket, setWebSocket] = useState<WebSocket | undefined>();
  const [loading, setLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<Array<ChatInstance>>([]);
  const [userTable, setUserTable] = useState<UserTable>({});
  const [selectedChat, setSelectedChat] = useState<ChatInstance | undefined>();
  const chime = new Audio("/assets/message_received.mp3");
  const [disconnected, setDisconnected] = useState(false);
  const [hasStartedChatWithRouteParam, setHasStartedChatWithRouteParam] =
    useState(false);

  // Attempt to establish a websocket connection to the server
  useEffect(() => {
    if (webSocket === undefined && authToken !== "") {
      console.log("Attempting to establish websocket connection...");
      const newWebSocket = new WebSocket(`${process.env.REACT_APP_API_WSS}/api/ws/connect`);
      setWebSocket(newWebSocket);

      newWebSocket.onmessage = (event) => {
        if (event.data && event.data.length > 0) {
          const data = JSON.parse(event.data);
          if (data.type === "init") {
            chatSessions.splice(0, chatSessions.length);
            let first = true;
            data.chats.forEach((chat: any) => {
              const chatInstance: ChatInstance = {
                _id: chat._id,
                personOne: chat.personOne,
                personTwo: chat.personTwo,
                messages: chat.messages,
              };
              chatSessions.push(chatInstance);
              setChatSessions([]);
              setChatSessions(chatSessions);
              if (first) {
                setSelectedChat(chatInstance);
                first = false;
              }
            });
            data.users.forEach((user: any) => {
              userTable[user._id] = {
                firstName: user.firstName,
                lastName: user.lastName,
              };
            });
            userTable[JSON.parse(authData).payload.id] = {
              firstName: JSON.parse(authData).payload.firstName,
              lastName: JSON.parse(authData).payload.lastName,
            };
            setUserTable({});
            setUserTable(userTable);
            if (loading) setLoading(false);
          } else if (data.type === "new_message") {
            console.log("New message received!");
            chime.play();
            if (!data.isNewChat) {
              chatSessions.forEach((chat: ChatInstance) => {
                if (
                  chat.personOne === data.personOne &&
                  chat.personTwo === data.personTwo
                ) {
                  if (chatSessions.indexOf(chat) > -1) {
                    chat.messages.push({
                      sender: data.from,
                      message: data.message,
                      when: data.when,
                    });
                  }
                }
              });
            } else {
              const chatInstance: ChatInstance = {
                _id: data.chatId,
                personOne: data.personOne,
                personTwo: data.personTwo,
                messages: [
                  {
                    sender: data.from,
                    message: data.message,
                    when: data.when,
                  },
                ],
              };

              userTable[data.fromUser.id] = {
                firstName: data.fromUser.firstName,
                lastName: data.fromUser.lastName,
              };

              userTable[data.toUser.id] = {
                firstName: data.toUser.firstName,
                lastName: data.toUser.lastName,
              };

              chatSessions.push(chatInstance);
              setSelectedChat(chatInstance);
            }

            userTable[JSON.parse(authData).payload.id] = {
              firstName: JSON.parse(authData).payload.firstName,
              lastName: JSON.parse(authData).payload.lastName,
            };

            setChatSessions([]);
            setChatSessions(chatSessions);
          }
        }
      };

      newWebSocket.onopen = () => {
        newWebSocket.send(
          JSON.stringify({
            type: "init",
            token: authToken,
          })
        );
        setLoading(false);
      };

      newWebSocket.onclose = () => {
        setDisconnected(true);
      };
    }
    // Start chat with selected user if it is set (match.params.id)
    if (
      !hasStartedChatWithRouteParam &&
      webSocket &&
      webSocket.readyState === webSocket.OPEN &&
      match.params.id &&
      match.params.id.length > 0 &&
      !loading
    ) {
      // Check if the user is already in a chat with the selected user
      let chatFound = false;
      for (const chat of chatSessions) {
        if (
          chat.personOne === match.params.id ||
          chat.personTwo === match.params.id
        ) {
          chatFound = true;
          setSelectedChat(chat);
        }
      }
      if (!chatFound) {
        webSocket.send(
          JSON.stringify({
            type: "send",
            token: authToken,
            to: match.params.id,
            message: "Hello, there!",
          })
        );
        setHasStartedChatWithRouteParam(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, webSocket, authToken]);

  // Show chat interface, and loading screen if websocket connection is not established
  if (
    (loading ||
      !authData ||
      !webSocket ||
      webSocket.readyState !== webSocket.OPEN) &&
    !disconnected
  ) {
    return (
      <div className="pt-32 text-2xl text-center">
        <h1>Messaging system loading...</h1>
      </div>
    );
  }

  if (disconnected) {
    return (
      <div className="pt-32 text-2xl text-center">
        <h1>
          You've been disconnected. Click{" "}
          <a
            className="font-bold underline"
            href={`/messages/?${randomBytes(6).toString("hex")}`}
          >
            here
          </a>{" "}
          to attempt reconnection.
        </h1>
      </div>
    );
  }

  // Messages interface (show sidebar with messages, tailwindcss)
  return (
    <>
      <div className="flex h-screen gap-1 bg-gray-300">
        <div className="col-span-3 md:w-1/6 flex-row overflow-y-scroll bg-white">
          <h3 className="text-2xl text-center py-4 text-gray-900 font-bold bg-tiffany-blue">
            Conversations
          </h3>
          {chatSessions.map((chatSession) => {
            const talkingTo =
              chatSession.personOne === JSON.parse(authData).payload.id
                ? chatSession.personTwo
                : chatSession.personOne;
            const talkingToUser = (userTable && userTable[talkingTo]) || {
              firstName: talkingTo,
              lastName: "",
            };
            return (
              <div
                onClick={() => {
                  // Set selected chat
                  setSelectedChat(chatSession);
                }}
                className={`w-full px-4 py-4 ${
                  chatSession === selectedChat ? "bg-light-cyan" : "bg-gray-200"
                }`}
                key={
                  JSON.parse(authData).payload.id +
                  talkingTo +
                  randomBytes(4).toString("hex")
                }
              >
                <p className="font-bold">
                  {talkingToUser.firstName + " " + talkingToUser.lastName}
                </p>
                <p className="text-sm">
                  Last message:{" "}
                  {chatSession.messages[
                    chatSession.messages.length - 1
                  ].message.substr(0, 36)}
                  ...
                </p>
              </div>
            );
          })}
        </div>
        <div className="col-span-9 bg-white md:w-5/6">
          {selectedChat && (
            <div className="flex-row h-full">
              <div className="border-t-4" style={{}}>
                <form
                  className=""
                  onSubmit={(event) => {
                    event.preventDefault();
                    const message = (event.target as any).elements.message
                      .value;
                    if (message && message.length > 0 && webSocket) {
                      // Send message to server
                      webSocket.send(
                        JSON.stringify({
                          type: "send",
                          token: authToken,
                          message: message,
                          to:
                            selectedChat.personOne ===
                            JSON.parse(authData).payload.id
                              ? selectedChat.personTwo
                              : selectedChat.personOne,
                        })
                      );
                      (event.target as any).elements.message.value = "";
                    }
                  }}
                >
                  <input
                    className="w-full px-4 py-2 bg-gray-200 mb-1 focus:outline-none"
                    type="text"
                    name="message"
                    placeholder="Type a message..."
                  />
                </form>
              </div>
              <div
                className="flex-grow overflow-y-scroll"
                style={{ height: "calc(100% - 53px)" }}
              >
                <div className="flex-col">
                  {selectedChat.messages.slice().map((messageObject, index) => {
                    // From
                    const from = (userTable &&
                      userTable[messageObject.sender]) || {
                      firstName: messageObject.sender,
                      lastName: "",
                    };
                    // If message is from current user, show message in green
                    const fromClass =
                      messageObject.sender === JSON.parse(authData).payload.id
                        ? "text-right"
                        : "";
                    const bubbleClass =
                      messageObject.sender === JSON.parse(authData).payload.id
                        ? "bg-light-cyan"
                        : "bg-gray-300";
                    return (
                      <div
                        className={`w-full px-4 py-4 ${fromClass}`}
                        key={index}
                      >
                        <p className="">
                          {from.firstName + " " + from.lastName} (
                          {new Date(messageObject.when).toLocaleString()})
                        </p>
                        <div
                          className="inline-block break-all"
                          style={{ maxWidth: "40%" }}
                        >
                          <p
                            className={`text-sm rounded-md px-4 py-2 ${bubbleClass}`}
                          >
                            {messageObject.message}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <p className="w-full text-center italic py-4">
                    End of conversation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSystem;
