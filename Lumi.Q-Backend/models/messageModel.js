const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    prompt: {
      type: String,
    },
    answer: {
      type : String, 
    }
    ,
    email: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", MessageSchema);