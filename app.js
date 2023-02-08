const express = require("express");
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
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/projects", projectRoutes);
app.use("/ticket", ticketRoutes);
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
// app.use("/login", authRoutes);

// Signed out pages
app.get("/", function (req, res) {
  res.render("home");
});

// app.get("/fake", async (req, res) => {
//   const user = new User({
//     email: "gibi.deebee@gmail.com",
//     username: "gibi4",
//     last: "gibi",
//     first: "deebee",
//     role: "admin",
//   });
//   const registedUser = await User.register(user, "chicken");
//   res.send(registedUser);
// });

app.get("/dashboard", isLoggedIn, function (req, res) {
  res.render("dashboards/index");
});

app.get("/credits", function (req, res) {
  res.render("others/credits");
});

app.all("*", (req, res, next) => {
  console.log("Hit all");
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error-template", { statusCode, message });
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
