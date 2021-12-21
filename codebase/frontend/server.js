require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");

const FRONTEND_PORT = process.env.FRONTEND_PORT || 8000;

app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(FRONTEND_PORT, () => {
  console.log(`Serving on port ${FRONTEND_PORT}`);
});
