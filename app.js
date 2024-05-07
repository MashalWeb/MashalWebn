require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var notesRouter = require("./routes/notesRouter");
var app = express();
const admainRouter = require("./routes/admain.route");
const checkForAuthCookie = require("./middleware/checkAuthCookie");
const { default: mongoose } = require("mongoose");

mongoose
   .connect(process.env.MONGODB_URL)
   .then((res) => console.log("DB CONNECTED"))
   .catch((err) => console.log("Error in DB CONNECTION ", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthCookie("tokan"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/Notes/", notesRouter);
app.use("/admain", admainRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render("error");
});

module.exports = app;
