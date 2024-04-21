const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require("cors")

app.use(cors())
app.use(bodyParser.json());

// Serve the html, css and js files
app.use(express.static("public"))

// Endpoint to get all todos
app.get("/todos", (req, res) => {
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos:", err);
      res.status(500).send("Error reading todos");
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Endpoint to add a new todo
app.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).send("Todo text is required");
    return;
  }
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos:", err);
      res.status(500).send("Error reading todos");
      return;
    }
    const todos = JSON.parse(data);
    const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
    todos.push({ id, text });
    fs.writeFile("todos.json", JSON.stringify(todos), err => {
      if (err) {
        console.error("Error writing todo:", err);
        res.status(500).send("Error writing todo");
        return;
      }
      res.sendStatus(200);
    });
  });
});

// Endpoint to delete a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).send("Invalid todo id");
    return;
  }
  fs.readFile("todos.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading todos:", err);
      res.status(500).send("Error reading todos");
      return;
    }
    let todos = JSON.parse(data);
    const index = todos.findIndex(todo => todo.id === id);
    if (index === -1) {
      res.status(404).send("Todo not found");
      return;
    }
    todos = todos.filter(todo => todo.id !== id);
    fs.writeFile("todos.json", JSON.stringify(todos), err => {
      if (err) {
        console.error("Error writing todos:", err);
        res.status(500).send("Error writing todos");
        return;
      }
      res.sendStatus(200);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
