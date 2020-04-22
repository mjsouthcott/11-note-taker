const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic GET functionality
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    return res.json(JSON.parse(data));
  });
});

// TODO: Basic POST functionality

// TODO: Basic DELTE functionality

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}.`));
