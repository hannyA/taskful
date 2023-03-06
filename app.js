const express = require("express");
const morgan = require("morgan");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const flash = require("connect-flash");
const MongoStore = require("connect-mongo");

const User = require("./models/user");
const Issue = require("./models/issue");
const Project = require("./models/project");

const { isLoggedIn } = require("./utils/middleware");
const projectRoutes = require("./routes/projects");
const ticketRoutes = require("./routes/tickets");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
// const { session } = require("passport");

// mongoose.connect("mongodb://localhost:27017/issue-tracker", {
//   // useNewUrlParser: true,
//   // useCreateIndex: true,
//   // useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

const app = express();
console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Get dev/prod url
let localDB = process.env.DATABASE_LOCAL;
let remoteDB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
).replace("<USERNAME>", process.env.DATABASE_USERNAME);

let mongoDB = process.env.NODE_ENV === "development" ? localDB : remoteDB;

// Set url for use in server.js
app.set("_mongoDB", mongoDB);

const store = MongoStore.create({
  mongoUrl: mongoDB,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.MONOGODB_STORE_SECRET,
  },
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR: ", e);
});

const sessionConfig = {
  store,
  secret: process.env.SESSION_CONFIG_SECRET,
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
  console.log("USER IS: ", req.user);
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

app.get(`/credits`, function (req, res) {
  res.render("others/credits");
});

app.all("*", (req, res, next) => {
  console.log("Hit all urls");
  console.log("req:", req.path); /// path, no query
  console.log("req:", req.originalUrl); // path including query

  const signedoutPages = ["/features", "/teams", "/pricing", "/support"];
  const signedinPages = [
    "/api/v1/assets",
    "/api/v1/tools",
    "/api/v1/ticket",
    "/api/v1/support",
  ];

  if (signedoutPages.includes(req.path)) {
    var n = req.path.lastIndexOf("/");

    let result = req.path.substring(n + 1);
    console.log("result: ", result);
    const page = result.charAt(0).toUpperCase() + result.slice(1);
    console.log("page:", page);

    return next(new ExpressError(`${page} page is under construction`, 503));
  } else if (signedinPages.includes(req.path)) {
    var n = req.path.lastIndexOf("/");

    let result = req.path.substring(n + 1);
    console.log("result: ", result);
    const page = result.charAt(0).toUpperCase() + result.slice(1);
    console.log("page:", page);

    return next(new ExpressError(`${page} page is under construction`, 503));
  }

  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  console.log("app.js: ", err);
  const { statusCode = 500, message = "Something went wrong" } = err;
  if (req.isAuthenticated()) {
    if (statusCode === 503) {
      return res
        .status(statusCode)
        .render("templates/errors/signedin-notfound-template", {
          statusCode,
          message,
        });
    }
    res.status(statusCode).render("templates/errors/signedin-error-template", {
      statusCode,
      message,
    });
  } else {
    res.status(statusCode).render("templates/errors/signedout-error-template", {
      statusCode,
      message,
    });
  }
});

module.exports = app;
