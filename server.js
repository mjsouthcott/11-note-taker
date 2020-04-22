const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic GET functionality
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    return res.json(notes);
  });
});

// Basic POST functionality
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      __dirname + "/db/db.json",
      JSON.stringify(notes),
      (err, data) => {
        if (err) throw err;
      }
    );
  });
});

// Basic DELETE functionality
app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id - 1;
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.splice(id, 1);
    fs.writeFile(
      __dirname + "/db/db.json",
      JSON.stringify(notes),
      (err, data) => {
        if (err) throw err;
      }
    );
  });
});

// Handle 404 errors by sending index.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}.`));
