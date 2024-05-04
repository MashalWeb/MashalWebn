var express = require("express");
var router = express.Router();
const userModel = require("../models/user.model");
const commentModel = require("../models/comments.model");
const upload = require("./multer");
const checkForAuthCookie = require("../middleware/checkAuthCookie");
const searchIndex = require("../Services/searchIndex")
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
   const user = await userModel.findOne({
      username: req.user.username,
   });
   res.render("profile", { title: `${user.username} Profile`, user });
});

//------------------------------------------

router.get(
   "/profileEdit",
   checkForAuthCookie("tokan"),
   async function (req, res, next) {
      const user = await userModel.findOne({
         username: req.user.username,
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
      await userModel.findByIdAndUpdate(req.user._id, {
         avatar: req.file.filename,
      });

      res.redirect("/profileEdit");
   } catch (error) {
      console.log("ERROR in /upload route:: ", error);
   }
});

//------------------------------------------

router.post("/updateDetails", async function (req, res) {
   let user = await userModel.findOne({ username: req.user.username });

   try {
      await user.updateOne({
         bio: req.body.bio,
         role: req.body.role,
      });

      res.redirect(`/profile`);
   } catch (error) {
      console.log("no updates: ", error.message);
   }
});

//------------------------------------------
router.post("/comment", async function (req, res) {
   var user = await userModel.findOne({
      username: req.user.username,
   });
   var commentText = req.body.commentText;
   const comment = await commentModel.create({
      commentText: commentText,
      commentBy: user,
   });
   res.redirect("/notes");
});

router.post("/search/result", function (req, res){
   const user = req.user;

   const searchWord = req.body.search.toLowerCase();

   const filterresult = searchIndex.filter(obj => obj.name.includes(searchWord));
   console.log(filterresult);
   res.render("searchResult", {title: "Search Result", user, filterresult, searchWord});
})
//------------------------------------------

module.exports = router;
