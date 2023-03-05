const mongoose = require("mongoose");
const Reaction = require("./Reaction");

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
    createdAt: { type: Date, default: Date.now },
    username: { type: String, required: true },
    reactions: [ {
      type: mongoose.Schema.Types.ObjectId,
      ref: Reaction,
    },],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual("reactionCount")
  .get(function () {
    return this.reactions.length;
  })
  .set(function () {
    let count = this.reactions.length;
    this.set({ count });
  });

const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
