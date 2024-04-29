const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
   commentText: {
      type: String,
      required: true,
   },
   commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
   post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
   },
});
module.exports = mongoose.model("Comment", commentSchema);
