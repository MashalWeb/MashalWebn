import commentModel from "../models/comments.model.js";
import { Router } from "express";

import { NinthClass, TenthClass, EleventhClass } from "./Data.js";

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
//Dynamic Routing --
//it show data according to the dynamic value in url /:subject

router.get("/KPK-Boards-Ninth-Class-Notes/:subject", async function (req, res) {
   const user = req.user;

   const subjectName = req.params.subject;

   const data = NinthClass[subjectName];

   res.render("ChpNotes9th", {
      title: `9th Class ${subjectName} Notes | Mashal Web`,
      user,
      subjectName,
      data,
   });
});
router.get("/KPK-Boards-Tenth-Class-Notes/:subject", async function (req, res) {
   const user = req.user;

   const subjectName = req.params.subject;

   const data = TenthClass[subjectName];

   res.render("ChpNotes10th", {
      title: `10th Class ${subjectName} Notes | Mashal Web`,
      user,
      subjectName,
      data,
   });
});
router.get(
   "/KPK-Boards-Eleventh-Class-Notes/:subject",

   async function (req, res) {
      const user = req.user;

      const subjectName = req.params.subject;

      const data = EleventhClass[subjectName];

      res.render("ChpNotes11th", {
         title: `11th Class ${subjectName} Notes | Mashal Web`,
         user,
         subjectName,
         data,
      });
   }
);

export default router;
