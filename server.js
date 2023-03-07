const express = require("express");
const db = require("./config/connection");

const { User, Thought, Reaction } = require("./models");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// User Routes

// Post a new user
app.post("/new-user", (req, res) => {
  const newUser = new User({ username: req.body.username, email: req.body.email });
  newUser.save();
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Find all the users
app.get("/all-users", (req, res) => {
  User.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  })
    .populate("thought")
    .populate("friends");
});
// Find a specific user by ID
app.get("/find-user/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});
// Update a user by their username
app.put("/update-user/:id", (req, res) => {
  User.findOneAndUpdate({ _id: req.params.id }, { username: req.body.username }, { new: true }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  });
});
// Delete a user by their username
app.delete("/delete-user/:id", (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Friend Routes

// Add a friend to a User
app.post("/new-friend", (req, res) => {
  User.create(req.body)
    .then((friend) => {
      return User.findOneAndUpdate(
        {
          _id: req.body.user_id,
        },
        {
          $addToSet: {
            friends: friend._id,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
    })
    .then((user) => {
      if (!user) {
        res.status(401).json(user);
      } else {
        res.status(200).json("friend added successfully");
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Delete a friend

// Find a users friends

// Thought Routes

// Post a thought
app.post("/new-thought", (req, res) => {
  Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        {
          _id: req.body.user_id,
        },
        {
          $addToSet: {
            thought: thought._id,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
    })
    .then((user) => {
      if (!user) {
        res.status(401).json(user);
      } else {
        res.status(200).json("thought created successfully");
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Get all of the thoughts
app.get("/all-thoughts", (req, res) => {
  Thought.find({}, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Find a single thought

app.get("/find-thought/:id", (req, res) => {
  Thought.findOne({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Update a thought

app.put("/update-thought/:id", (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.id }, { thoughtText: req.body.thoughtText }, { new: true }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ message: "something went wrong" });
    }
  });
});

// Delete a thought

app.delete("/delete-thought/:id", (req, res) => {
  Thought.findOneAndDelete({ _id: req.params.id }, (err, result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json({ error: "Something went wrong" });
    }
  });
});

// Reaction routes

// Create a reaction
app.post("/new-reaction", (req, res) => {
  Reaction.create(req.body)
    .then((reaction) => {
      return Thought.findOneAndUpdate(
        {
          _id: req.body.thought_id,
        },
        {
          $addToSet: {
            reactions: reaction._id,
          },
        },
        {
          runValidators: true,
          new: true,
        }
      );
    })
    .then((user) => {
      if (!user) {
        res.status(401).json(user);
      } else {
        res.status(200).json("reaction created successfully");
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

// Delete a reaction

app.delete("/delete-reaction/:id", (req, res) => {
  Reaction.findOneAndDelete({ _id: req.params.id }, (err, result) => {
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
