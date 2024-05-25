import express from "express";
import upload from "./multer.js";

import {
   admainLogin,
   admainLogout,
   admainPage,
   createBlog,
   DeleteComment,
} from "../Controllers/admain.controller.js";

const router = express.Router();

router.get("/login", (req, res) => {
   res.render("admainLogin");
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

router.post("/admainLogin", admainLogin);

router.get("/", admainPage);

router.get("/logout", admainLogout);

router.get("/comment/delete/:commentId", DeleteComment);

router.post("/createBlog", upload.single("blogImg"), createBlog);

export default router;
