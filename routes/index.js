var express = require("express");
var router = express.Router();
const userModel = require("../models/user.model");
const commentModel = require("../models/comments.model");
const upload = require("./multer");

/* GET home page. */

//-----------------------------------

router.get("/", async function (req, res, next) {
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
   res.render("register", { title: "SignUp | Register", user }); //
});

//---------------------------------------

router.get("/login", function (req, res, next) {
   const user = req.user;
   res.render("login", { title: "Login | SignUp", user }); //
});

//----------------------------------------

//-----------------------------------------

router.get("/profile/:username", async function (req, res) {
   const user = req.user;
   const urlUser = req.params.username;
   let userd = await userModel.findOne({ username: urlUser });
   res.render("profile", { title: `${userd.username} Profile`, userd, user });
});

//------------------------------------------

router.get("/profileEdit", async function (req, res, next) {
   const user = req.user;
   let logUser = await userModel.findOne({
      username: user.username,
   });
   let userData = {
      logUser: logUser.username,
      logEmail: logUser.email,
      avatar: logUser.avatar,
      logBio: logUser.bio,
   };
   res.render("profileEdit", { title: "Edit Your Profile", userData, user });
});
router.get("/Notes", async function (req, res) {
   let user = req.user;
   const comments = await commentModel.find({}).populate("commentBy");
   res.render("Notes", { title: "Chapter Wise Notes", comments, user });
});
//----------------------------------

//-----------------------------------------

// post request

//----------------------------------------

router.post("/register", async function (req, res) {
   const { username, email, password } = req.body;

   try {
      if (!username || !email || !password) {
         console.log("All Fields require!!");
         return null;
      }
      const exitedUser = await userModel.findOne({ email: email });

      if (exitedUser) throw new Error("User Alerady Exist With this email");

      const CreatedUser = await userModel.create({
         username,
         email,
         password,
      });

      res.redirect("/login");
      //
   } catch (error) {
      let user = req.user;

      console.log("register error", error.message);
      res.render("register", {
         user,
         title: "SignUp | Register",
         error: "User with this email is exist",
      });
   }
});

//------------------------------------------

router.post("/login", async function (req, res) {
   const { email, password } = req.body;

   try {
      if (!email || !password) {
         console.log("All fields are required");
         return null;
      }

      const tokan = await userModel.passwordMatchAndGenerateTokan(
         email,
         password
      );
      res.cookie("tokan", tokan).redirect("/");
   } catch (error) {
      console.log("Login Error ::", error.message);

      const user = req.user;

      res.render("login", {
         error,
         title: "Login | Sigin",
         user,
      });
   }
});
//----------------------------------------

router.get("/logout", function (req, res) {
   res.clearCookie("tokan");
   res.redirect("/login");
});

//----------------------------------------

router.post("/upload", upload.single("image"), async function (req, res) {
   try {
      const user = await userModel.findOne({
         username: req.user.username,
      });
      if (user) {
         user.avatar = req.file.filename;
         await user.save();
         res.redirect("/profileEdit");
      }
      console.log("no user found");
   } catch (error) {
      console.log("ERROR in /upload route:: ", error);
   }
});

//------------------------------------------

router.post("/updateDetails", async function (req, res) {
   let user = await userModel.findOne({ username: req.user.username });
   if (user) {
      user.bio = req.body.bio;
      user.role = req.body.role;
      await user.save();
      res.redirect(`/profile/${user.username}`);
   }
   console.log("error:::");
});

//------------------------------------------
router.post("/comment", async function (req, res) {
   var user = req.user;
   var commentText = req.body.commentText;
   const comment = await commentModel.create({
      commentText: commentText,
      commentBy: user,
   });
   res.redirect("/notes");
});

//------------------------------------------

module.exports = router;
