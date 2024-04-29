const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
   {
      postHeading: String,
      postContent: String,
      createdBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
      },
   },
   { timestamps: true }
);
const Post = (module.exports = mongoose.model("Post", postSchema)); 
