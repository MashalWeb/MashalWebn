import uploadOnCloudinary from "../Services/cloudinary.js";
import User from "../models/user.model.js";

export const SignUp = async function (req, res) {
   const { username, email, password } = req.body;

   try {
      if (!username || !email || !password) {
         console.log("All Fields require!!");
         return null;
      }

      const exitedUser = await User.findOne({ email: email });

      if (exitedUser) throw new Error("User Alerady Exist With this email");

      await User.create({
         username,
         email,
         password,
      });

      res.redirect("/login");
   } catch (error) {
      let user = req.user;

      console.log("register error", error.message);

      res.render("register", {
         user,
         title: "SignUp | Register",
         error: "User with this email is exist",
      });
   }
};

export const SignIn = async function (req, res) {
   const { email, password } = req.body;

   try {
      if (!email || !password) {
         console.log("All fields are required");
         return null;
      }

      const tokan = await User.passwordMatchAndGenerateTokan(email, password);
      res.cookie("tokan", tokan).redirect("/");
   } catch (error) {
      console.log("Login Error ::", error.message);

      const user = req.user;

      res.render("login", {
         error,
         title: "Login | SignIn",
         user,
      });
   }
};

export const Logout = function (req, res) {
   res.clearCookie("tokan");
   res.redirect("/login");
};

export const uploadAvatar = async function (req, res) {
   try {
      const localFilePath = req.file.path;

      if (!localFilePath) {
         console.log("No Files is given");
      }

      console.log(localFilePath);

      // for deveployment

      // const avatar = await uploadOnCloudinary(localFilePath);

      await User.findByIdAndUpdate(req.user._id, {
         avatar: req.file.filename, //avatar.url
      });

      res.redirect("/profileEdit");
   } catch (error) {
      console.log("ERROR in /upload route:: ", error);

      res.redirect("/profileEdit");
   }
};

export const updateDetails = async function (req, res) {
   let user = await User.findOne({ username: req.user.username });

   try {
      await user.updateOne({
         bio: req.body.bio,
         role: req.body.role,
      });

      res.redirect(`/profile`);
   } catch (error) {
      console.log("no updates: ", error.message);
   }
};
