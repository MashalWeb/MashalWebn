import dotenv from "dotenv";
dotenv.config();

import http from "http";
import createError from "http-errors";
import debug from "debug";
import logger from "morgan";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index.js";
import notesRouter from "./routes/notesRouter.js";
import admainRouter from "./routes/admain.route.js";
import checkForAuthCookie from "./middleware/checkAuthCookie.js";
import connectMongoDB from "./DB/mongoDB.js";

const app = express();

// mongoDB Connection

connectMongoDB();

// view engine setup

app.set("views", path.join("./views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(checkForAuthCookie("tokan"));

app.use(express.static(path.join("./public")));

// routes

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

   res.status(err.status || 500);
   res.render("error");
});

// server configurations

var port = normalizePort(process.env.PORT || "4000");
app.set("port", port);
console.log("Server is listing at port: ", port);

// Create HTTP server.

var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
   var port = parseInt(val, 10);

   if (isNaN(port)) {
      return val;
   }

   if (port >= 0) {
      return port;
   }

   return false;
}

function onError(error) {
   if (error.syscall !== "listen") {
      throw error;
   }

   var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

   switch (error.code) {
      case "EACCES":
         console.error(bind + " requires elevated privileges");
         process.exit(1);
         break;

      case "EADDRINUSE":
         console.error(bind + " is already in use");
         process.exit(1);
         break;

      default:
         throw error;
   }
}

function onListening() {
   var addr = server.address();
   var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
   debug("Listening on " + bind);
}
