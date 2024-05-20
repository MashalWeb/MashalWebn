//models

import adminModel from "../models/admin.model.js";
import userModel from "../models/user.model.js";
import commentModel from "../models/comments.model.js";
import blogsModel from "../models/blogs.model.js";

// other files

import express from "express";
import { validateTokanAdmian } from "../Services/authentication.js";
import upload from "./multer.js";

const router = express.Router();

router.get("/login", (req, res) => {
   res.render("admainLogin");
});

/*   ----- post request -----   */

router.post("/admainLogin", async function (req, res) {
   const { email, password } = req.body;

   try {
      if (!email || !password) throw new Error("All Fields Required !!");

      const tokan = await adminModel.LoginAndGenTokan(email, password);

      res.cookie("admainTokan", tokan).redirect("/admain");
   } catch (error) {
      res.render("admainLogin", { error });
   }
});
// create admains manually

router.get("/", async function (req, res) {
   const tokanCookieValue = req.cookies.admainTokan;

   if (!tokanCookieValue) {
      res.redirect("/admain/login");
   }
   try {
      const admainData = validateTokanAdmian(tokanCookieValue);

      const users = await userModel.find({});

      const comments = await commentModel.find({}).populate("commentBy");

      res.render("Admain", { admainData, users, comments });
   } catch (error) {
      console.log("error", error);
   }
});

router.get("/logout", function (req, res) {
   res.clearCookie("admainTokan");

   res.redirect("/admain/login");
});

router.get("/comment/delete/:commentId", async (req, res) => {
   try {
      const response = await commentModel.findByIdAndDelete(
         req.params.commentId
      );

      res.redirect("/admain");
   } catch (error) {
      console.log("comment Error :: ", error);
   }
});

router.get("/createBlogPage", (req, res) => {
   const tokanCookieValue = req.cookies.admainTokan;
   try {
      if (tokanCookieValue) {
         res.render("createBlog");
      }
   } catch (error) {
      console.log("error ::");
      res.redirect("/admain/login");
   }
});

router.post("/createBlog", upload.single("blogImg"), async function (req, res) {
   const { title, innerHtml, Category, blogCaption } = req.body;

   let blogImg = req.file.filename;

   try {
      if (!title || !innerHtml) {
         throw new Error("All Fields Required!!");
      }

      const response = await blogsModel.create({
         blogTitle: title,
         blogCaption: blogCaption,
         blogContent: innerHtml,
         blogImg: blogImg,
         blogCategory: Category,
      });

      console.log("created", response);

      res.redirect("/admain");
   } catch (error) {
      throw new Error(error);
   }
});

export default router;
