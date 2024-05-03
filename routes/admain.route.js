const express = require("express");
const adminModel = require("../models/admin.model");
const { validateTokanAdmian } = require("../Services/authentication");
const router = express.Router();
const userModel = require("../models/user.model");
const commentModel = require("../models/comments.model");
router.get("/login", (req, res) => {
   res.render("admainLogin");
});

//post
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
      //
      console.log("error", error);
   }
});
router.get("/logout", function (req, res) {
   console.log("hi");
   res.clearCookie("admainTokan");
   res.redirect("/admain/login");
});
module.exports = router;
