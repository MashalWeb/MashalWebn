const jwt = require("jsonwebtoken");
const SECRET_KEY = "$uperMashal";

function CreateTokensForUser(user) {
   const payload = {
      // payload --> data
      _id: user._id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      role: user.role,
      bio: user.bio,
   };
   const tokan = jwt.sign(payload, SECRET_KEY);
   return tokan;
}

function validateTokan(tokan) {
   const payload = jwt.verify(tokan, SECRET_KEY);
   return payload;
}

//admain

function CreateTokensForAdmain(admain) {
   const payload = {
      // payload --> data
      _id: admain._id,
      email: admain.aEmail,
   };
   const tokan = jwt.sign(payload, SECRET_KEY);
   return tokan;
}

function validateTokanAdmian(tokan) {
   const payload = jwt.verify(tokan, SECRET_KEY);
   return payload;
}

module.exports = {
   CreateTokensForUser,
   validateTokan,
   CreateTokensForAdmain,
   validateTokanAdmian,
};
