import adminModel from "../models/admin.model.js";
import commentsModel from "../models/comments.model.js";
import blogsModel from "../models/blogs.model.js";
import User from "../models/user.model.js";
import { validateTokanAdmian } from "../Services/authentication.js";

export const admainPage = async function (req, res) {
   const tokanCookieValue = req.cookies.admainTokan;

   if (!tokanCookieValue) {
      res.redirect("/admain/login");
   }
   try {
      const admainData = validateTokanAdmian(tokanCookieValue);

      const users = await User.find({});

      const comments = await commentsModel.find({}).populate("commentBy");

      res.render("Admain", { admainData, users, comments });
   } catch (error) {
      console.log("error", error);
   }
};

export const admainLogin = async function (req, res) {
   const { email, password } = req.body;

   try {
      if (!email || !password) throw new Error("All Fields Required !!");

      const tokan = await adminModel.LoginAndGenTokan(email, password);

      res.cookie("admainTokan", tokan).redirect("/admain");
   } catch (error) {
      res.render("admainLogin", { error });
   }
};

export const admainLogout = async function () {
   res.clearCookie("admainTokan");
   res.redirect("/admain/login");
};

export const DeleteComment = async (req, res) => {
   try {
      await commentsModel.findByIdAndDelete(req.params.commentId);

      res.redirect("/admain");
   } catch (error) {
      console.log("comment Error :: ", error);
   }
};

export const createBlog = async function (req, res) {
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
      console.log("CreateBlog ERROR ::", error);

      throw new Error(error);
   }
};
