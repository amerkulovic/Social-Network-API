const mongoose = require("mongoose");
const Thought = require("./Thought");

let validateEmail = function (email) {
  let response = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return response.test(email);
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, trim: true, required: true },
    email: { type: String, unique: true, required: true, validate: [validateEmail, "Please fill a valid email address"], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"] },
    thought: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: Thought,
      },
    ],
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual("friendCount")
  .get(function () {
    return this.friends.length;
  })
  .set(function () {
    let count = this.friends.length;
    this.set({ count });
  });

const User = mongoose.model("User", userSchema);

const handleError = (err) => console.error(err);

module.exports = User;
