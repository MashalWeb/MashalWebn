import express from "express";

// models
import User from "../models/user.model.js";
import commentModel from "../models/comments.model.js";
import blogsModel from "../models/blogs.model.js";

// controllers

import {
   SignUp,
   SignIn,
   Logout,
   uploadAvatar,
   updateInfo,
} from "../Controllers/user.controller.js";

//other files
import upload from "./multer.js";
import checkForAuthCookie from "../middleware/checkAuthCookie.js";
import searchIndex from "../Services/searchIndex.js";
import Quotes from "../public/javascripts/quotes.js";

const router = express.Router();
//-----------------------------------

router.get("/", async function (req, res, next) {
   console.log("hi");
   const user = req.user;
   res.render("index", {
      title: "Mashal Web",
      user,
   });
});
// ----------------------------------

//-----------------------------------

router.get("/register", function (req, res, next) {
   const user = req.user;
   res.render("register", { title: "SignUp | Register", user }); //vbxcv
});

//---------------------------------------

router.get("/login", function (req, res, next) {
   const user = req.user;
   res.render("login", { title: "Login | SignUp", user }); //
});

//----------------------------------------

//-----------------------------------------

router.get("/profile", checkForAuthCookie("tokan"), async function (req, res) {
   const user = await User.findOne({
      _id: req.user._id,
   });
   console.log(user);
   res.render("profile", { title: `${user.username} Profile`, user });
});

//------------------------------------------

router.get(
   "/profileEdit",
   checkForAuthCookie("tokan"),
   async function (req, res, next) {
      const user = await User.findOne({
         _id: req.user._id,
      });
      res.render("profileEdit", { title: "Edit Your Profile", user });
   }
);

//-------------

router.get("/Notes", async function (req, res, next) {
   const user = req.user;
   const comments = await commentModel.find({}).populate("commentBy");

   res.render("Notes", { title: "Chapter Wise Notes", comments, user });
});

//------------------

router.get("/Blogs", async (req, res) => {
   const user = req.user;
   const Blogs = await blogsModel.find({});

   res.render("Blogs", { title: "Blogs | Mashal Web", user, Blogs });
});

router.get("/Blogs/:blogId/:blogName", async function (req, res) {
   const isAdmainLogin = req.cookies.admainTokan;
   const blog = await blogsModel.findOne({
      _id: req.params.blogId,
   });
   const user = req.user;
   const Blogs = await blogsModel.find({});
   try {
      if (blog) {
         res.render("blogView", {
            blog,
            title: `${blog.blogTitle} | Mashal Web`,
            user,
            Blogs,
            isAdmainLogin,
         });
      }
   } catch (error) {
      console.log("Error ::", error);
   }
});

router.post("/Blog/:blogId/comment", async function (req, res) {
   const { comment, commentBy, commentEmail } = req.body;
   const blog = await blogsModel.findById(req.params.blogId);
   blog.blogComments.push({
      comment: comment,
      commentBy: commentBy,
      commentEmail: commentEmail,
   });

   await blog.save({ validateBeforeSave: true });
   res.redirect("back");
});

router.get("/Blog/:blogId/edit", async function (req, res) {
   const blog = await blogsModel.findById(req.params.blogId);

   if (!blog) return null;

   res.render("blogEdit", { blog });
});

//
router.post("/Blog/:blogId/edit", async function (req, res) {
   const { title, blogCaption, innerHtml } = req.body;
   const blog = await blogsModel.findById(req.params.blogId);
   try {
      if (!blog) throw new Error("Blog Is Not Found!!");

      blog.blogTitle = title;
      blog.blogCaption = blogCaption;
      blog.blogContent = innerHtml;

      await blog.save({ validateBeforeSave: true });

      res.redirect("/Blogs");
   } catch (error) {
      console.log(error);
      res.redirect("back");
   }
});

/*  ------ post requests ------   */

//user routes

router.post("/register", SignUp);
router.post("/login", SignIn);
router.get("/logout", Logout);
router.post("/upload", upload.single("image"), uploadAvatar);
router.post("/updateInfo", updateInfo);

router.post("/comment", async function (req, res) {
   var user = await User.findOne({
      _id: req.user._id,
   });
   var commentText = req.body.commentText;

   const comment = await commentModel.create({
      commentText: commentText,
      commentBy: user,
   });
   res.redirect("/notes");
});

router.post("/search/result", function (req, res) {
   const user = req.user;

   const searchWord = req.body.search.toLowerCase().trim();

   const filterresult = searchIndex.filter((obj) =>
      obj.name.includes(searchWord)
   );

   res.render("searchResult", {
      title: "Search Result",
      user,
      filterresult,
      searchWord,
   });
});
router.get("/All-Classes-Past-Year-Papers", async function (req, res) {
   const user = req.user;

   const Blogs = await blogsModel.find({});

   res.render("selPaper", {
      title: "All Classes Past Year Papers | Mashal Web",
      user,
      Blogs,
   });
});

router.get("/AboutMe/Mashal-Horara", (req, res) => {
   const user = req.user;

   res.render("A&C", { title: "Mashal Horara", user });
});

router.get("/quotes/generate", (req, res) => {
   const randQuote = Math.floor(Math.random() * Quotes.length);

   res.json({
      data: Quotes[randQuote],
   });
});
//------------------------------------------

export default router;
