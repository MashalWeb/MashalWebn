const commentModel = require("../models/comments.model");
const userModel = require("../models/user.model");
const { Router } = require("express");
const router = Router();


router.get("/KPK-Boards-Ninth-Class-Notes", async function (req, res) {
   const comments = await commentModel.find({}).populate("commentBy");
   const user = req.user;
   res.render("9th-class", {
      title: "KPK Board Ninth Class Notes | Mashal Web",
      user,
      comments,
   });
});
router.get("/KPK-Boards-Tenth-Class-Notes", async function (req, res) {
   const comments = await commentModel.find({}).populate("commentBy");
   const user = req.user;
   res.render("10th-class", {
      title: "KPK Board Tenth Class Notes | Mashal Web",
      user,
      comments,
   });
});
router.get("/KPK-Boards-Eleventh-Class-Notes", async function (req, res) {
   const comments = await commentModel.find({}).populate("commentBy");
   const user = req.user;
   res.render("11th-class", {
      title: "KPK Board Eleventh Class Notes | Mashal Web",
      user,
      comments,
   });
});
router.get("/KPK-Boards-Twelfth-Class-Notes", async function (req, res) {
   const comments = await commentModel.find({}).populate("commentBy");
   const user = req.user;
   res.render("12th-class", {
      title: "KPK Board Twelfth Class Notes | Mashal Web",
      user,
      comments,
   });
});
//Dynamic Routing --the greatest one feature which I Never Build Before
//it show data according to the dynamic value in url /:subject
router.get("/KPK-Boards-Ninth-Class-Notes/:subject", async function (req, res) {
   const user = req.user;
   const subjectName = req.params.subject;
   res.render("ChpNotes9th", {
      title: `9th Class ${subjectName} Notes | Mashal Web`,
      user,
      subjectName,
   });
});

module.exports = router;
