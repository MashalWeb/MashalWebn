const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const { CreateTokensForAdmain } = require("../Services/authentication");
const admainSchema = new mongoose.Schema({
   aEmail: String,
   salt: String,
   aPassword: String,
});

admainSchema.pre("save", function (next) {
   const admain = this;
   if (!admain.isModified("aPassword")) return;
   const salt = randomBytes(10).toString();
   const hashPassword = createHmac("sha256", salt)
      .update(admain.aPassword)
      .digest("hex");
   this.salt = salt;
   this.aPassword = hashPassword;
   next();
});

// login methord

admainSchema.static("LoginAndGenTokan", async function (email, password) {
   const admain = await this.findOne({ aEmail: email });
   if (!admain) throw new Error("No Admain With Email !!");

   const salt = admain.salt;
   const hashPassword = admain.aPassword;

   const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

   if (hashPassword !== userProvidedHash) {
      throw new Error("Email or Password Incorrect!!");
   }
   const admainTokan = CreateTokensForAdmain(admain);
   return admainTokan;
});

//
module.exports = mongoose.model("admain", admainSchema);
