const mongoose = require("mongoose");

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
      Date: {
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
