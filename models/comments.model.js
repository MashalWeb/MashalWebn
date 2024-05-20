import mongoose from "mongoose";
const commentSchema = mongoose.Schema({
   commentText: {
      type: String,
      required: true,
   },
   commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
});
export default mongoose.model("Comment", commentSchema);
