const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Define app GET methods that serve web content and provide API endpoint
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

// Define app POST method to add new notes at API endpoint
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);

    // Create and assign unique note id
    newNote.id = uuidv4();
    notes.push(newNote);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      else return res.json(notes);
    });
  });
});

// Define app DELETE method to delete notes by id at API endpoint
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.splice(req.params.id - 1, 1);
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      else return res.json(notes);
    });
  });
});

// Handle 404 errors by serving index.html
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public/index.html"));
});

// Run app
app.listen(PORT, () => console.log(`App is listening on PORT ${PORT}.`));
