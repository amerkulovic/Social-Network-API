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
  }).populate("thought");
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
  User.findOneAndUpdate({ _id: req.params.id }, { username: req.body.username, email: req.body.email }, { new: true }, (err, result) => {
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
app.post("/new-friend/:userId/:friendId", (req, res) => {
  User.findOneAndUpdate(req.params.userId)
    .then((friend) => {
      return User.findOneAndUpdate(
        {
          _id: req.params.userId,
        },
        {
          $addToSet: {
            friends: req.params.friendId,
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

// app.post("/new-reaction/:thoughtId", (req, res) => {
//   Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true })
//     .then((thought) => (!thought ? res.status(404).json({ message: "No thought with this id!" }) : res.json(thought)))
//     .catch((err) => res.status(500).json(err));
// });

// Delete a friend

app.delete("/remove-friend/:userId/:friendId", (req, res) => {
  User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { runValidators: true, new: true })
    .then((user) => (!user ? res.status(404).json({ message: "No user with this id!" }) : res.json(user)))
    .catch((err) => res.status(500).json(err));
});

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

// Add a reaction
app.post("/new-reaction/:thoughtId", (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $addToSet: { reactions: req.body } }, { runValidators: true, new: true })
    .then((thought) => (!thought ? res.status(404).json({ message: "No thought with this id!" }) : res.json(thought)))
    .catch((err) => res.status(500).json(err));
});

// Delete a reaction

app.delete("/remove-reaction/:thoughtId/:reactionId", (req, res) => {
  Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true })
    .then((thought) => (!thought ? res.status(404).json({ message: "No thought with this id!" }) : res.json(thought)))
    .catch((err) => res.status(500).json(err));
});

// Server Port

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
