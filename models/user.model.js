const { randomBytes, createHmac } = require("crypto");
const mongoose = require("mongoose");
const {
   CreateTokensForUser,
   validateTokan,
} = require("../Services/authentication");
mongoose
   .connect("mongodb://127.0.0.1:27017/mashalweb")
   .then((res) => console.log("DB CONNECTED"))
   .catch((err) => console.log("Error in DB CONNECTION ", err));
const userSchema = new mongoose.Schema({
   username: {
      type: String,
   },
   email: {
      type: String,
   },
   salt: String,
   password: {
      type: String,
   },
   avatar: {
      type: String,
   },
   role: {
      type: String,
      default: "Student",
   },
   posts: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post",
         default: [],
      },
   ],
   bio: {
      type: String,
   },
});

// hashing a password before save

userSchema.pre("save", function (next) {
   const user = this;

   if (!user.isModified("password")) return;

   const salt = randomBytes(16).toString();

   const hashPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");

   this.salt = salt;
   this.password = hashPassword;

   next();
});

// custom methords

userSchema.static(
   "passwordMatchAndGenerateTokan",
   async function (email, password) {
      const user = await this.findOne({ email });

      if (!user) throw new Error("User Cannot Found With This Email");

      const salt = user.salt;
      const hashPassword = user.password;

      const userProvidedHash = createHmac("sha256", salt)
         .update(password)
         .digest("hex");

      if (hashPassword !== userProvidedHash)
         throw new Error("Password is incorrect");

      const tokan = CreateTokensForUser(user);
      return tokan;
   }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
