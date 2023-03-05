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

const Reaction = mongoose.model("Reaction", reactionSchema);

module.exports = Reaction;
