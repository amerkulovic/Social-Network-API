const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    reactionBody: { type: String, required: true, maxLength: 280 },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

reactionSchema.virtual("reactionId").get(function () {
  return this._id;
});

const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
    createdAt: { type: Date, default: Date.now },
    username: { type: String, required: true },
    reactions: [reactionSchema],
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

const handleError = (err) => console.error(err);

module.exports = Thought;
