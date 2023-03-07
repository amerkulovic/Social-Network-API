const mongoose = require("mongoose");
const Schema = require("mongoose");

const reactionSchema = new mongoose.Schema(
  {
    reactionId: { type: Schema.Types.ObjectId, default: () => new Schema.Types.ObjectId() },
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

module.exports = reactionSchema;
