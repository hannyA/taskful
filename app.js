const express = require("express");
const morgan = require("morgan");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");

const User = require("./models/user");
const Issue = require("./models/issue");
const Project = require("./models/project");

const { isLoggedIn } = require("./utils/middleware");
const projectRoutes = require("./routes/projects");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
// const { session } = require("passport");

mongoose.connect("mongodb://localhost:27017/issue-tracker", {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "TODO_Change this secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.apiVersion = "v1";
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const version = "v1";
app.use(`/api/${version}/projects`, projectRoutes);
app.use(`/api/${version}/ticket`, ticketRoutes);
app.use(`/api/${version}/admin`, adminRoutes);
app.use(`/api/${version}/auth`, authRoutes);
// app.use("/login", authRoutes);

// Signed out pages
app.get(`/`, function (req, res) {
  res.render("home");
});

app.get(`/api/${version}/dashboard`, isLoggedIn, function (req, res) {
  res.render("dashboards/index");
});

app.get(`/api/${version}/credits`, function (req, res) {
  res.render("others/credits");
});

app.all("*", (req, res, next) => {
  console.log("Hit all urls");
  console.log("req:", req.path);
  console.log("req:", req.originalUrl);
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (req.isAuthenticated()) {
    res
      .status(statusCode)
      .render("templates/signedin-error-template", { statusCode, message });
  } else {
    res
      .status(statusCode)
      .render("templates/signedout-error-template", { statusCode, message });
  }
});

module.exports = app;
