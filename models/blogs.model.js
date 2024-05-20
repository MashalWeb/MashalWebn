import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
   {
      blogTitle: String,
      blogCaption: String,
      blogContent: String,
      blogImg: String,
      blogCategory: {
         type: ["Education", "Technology", "Tip & Trick"],
         default: [],
      },
      blogComments: [],
      Date: {
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true }
);
export default mongoose.model("Blog", blogSchema);
