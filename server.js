const express = require("express");
const db = require("./config/connection");

const { User, Thought } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// User Routes

app.post("/new-user", (req, res) => {
  const newUser = new User({ username: req.body.username, email: req.body.email });
  newUser.save();
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/all-users", (req, res) => {
  User.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

app.put("/update-user/:user", (req, res) => {
  User.findOneAndUpdate({ username: req.params.user }, { username: req.body.username }, { new: true }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  });
});

app.delete("/delete-user/:username", (req, res) => {
  User.findOneAndDelete({ username: req.params.username }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Thought Routes

app.post("/new-thought", (req, res) => {
  const newThought = new Thought({ thoughtText: req.body.thoughtText, username: req.body.username });
  newThought.save();
  if (newThought) {
    res.status(201).json(newThought);
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/all-thoughts", (req, res) => {
  Thought.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Server Port

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
