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
const dashRoutes = require("./routes/dashboard");
const accountRoutes = require("./routes/account");
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
app.use(
  "/scripts",
  express.static(__dirname + "/node_modules/js-datepicker/dist/")
);

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
  res.locals.companyName = "Taskful";
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

const version = "v1";
app.use(`/api/${version}/projects`, projectRoutes);
app.use(`/api/${version}/tickets`, ticketRoutes);
app.use(`/api/${version}/admin`, adminRoutes);
app.use(`/api/${version}/auth`, authRoutes);
app.use(`/api/${version}/dashboard`, dashRoutes);
app.use(`/api/${version}/account`, accountRoutes);
// app.use("/login", authRoutes);

// Signed out pages
app.get(`/`, function (req, res) {
  if (res.locals.currentUser) {
    return res.redirect(`/api/${version}/dashboard`);
  }
  res.render("home/home", { navbar: "home" });
});

app.get(`/credits`, function (req, res) {
  res.render("home/credits", { navbar: "none" });
});

app.get(`/pricing`, function (req, res) {
  const plans = [
    {
      type: "Basic",
      description:
        "For individuals or teams just getting started with project management.",
      price: 8.99,
      priceDesc: "Free forever",
      subTitle: "Manage tasks and personal to-dos:",
      benefits: [
        "Unlimited tasks",
        "Unlimited projects",
        "Unlimited messages",
        "Unlimited activity log",
        "Unlimited file storage (100MB per file)",
        "Collaborate with up to 15 teammates",
        "List view projects",
        "Board view projects",
      ],
    },
    {
      type: "Premium",
      description:
        "For teams that need to create project plans with confidence.",
      price: 16.99,
      priceDesc: "Per user, per month billed annually $16.99 billed monthly",
      subTitle: "Track team projects with features and resources like:",
      benefits: [
        "Calendar view",
        "Assignee and due dates",
        "Project Overview",
        "Project Brief",
        "iOS and Android mobile apps",
        "Time tracking with integrations - See time tracking apps",
        "100+ free integrations with your favorite apps - Learn more",
      ],
    },
    {
      type: "Enterprise",
      description:
        "For teams and companies that need to manage work across initiatives.",
      price: 22.99,
      priceDesc: "Per user, per month billed annually $22.99 billed monthly",
      subTitle: "Everything in Premium, plus:",
      benefits: [
        "Portfolios",
        "Goals",
        "Workload",
        "Custom rules builder",
        "Forms branching & customization",
        "Approvals",
        "Proofing",
        "Lock custom fields",
      ],
    },
  ];

  res.render("home/price", { navbar: "pricing", plans });
});

app.all("*", (req, res, next) => {
  console.log("Hit all urls");
  console.log("req:", req.path); /// path, no query
  console.log("req:", req.originalUrl); // path including query

  const signedoutPages = ["/features", "/teams", "/pricing", "/support"];
  const signedinPages = [
    "/api/v1/assets",
    "/api/v1/tools",
    "/api/v1/tickets",
    "/api/v1/support",
  ];

  if (signedoutPages.includes(req.path)) {
    var n = req.path.lastIndexOf("/");

    let result = req.path.substring(n + 1);
    // console.log("result: ", result);
    const page = result.charAt(0).toUpperCase() + result.slice(1);
    // console.log("page:", page);

    const navbar = result;

    console.log("app navbar: ", navbar);
    return next(
      new ExpressError(`${page} page is under construction`, 503, navbar)
    );
  } else if (signedinPages.includes(req.path)) {
    var n = req.path.lastIndexOf("/");

    let result = req.path.substring(n + 1);
    // console.log("result: ", result);
    const page = result.charAt(0).toUpperCase() + result.slice(1);
    // console.log("page:", page);

    const navbar = result;
    return next(
      new ExpressError(`${page} page is under construction`, 503, navbar)
    );
  }
  next(new ExpressError("Page not found", 404));
});

const errorImages = {
  notAuthorized: {
    id: "not-authorized",
    src: "/images/not-authorized.jpg",
    alt: "Not authorized image",
  },
  underConstruction: {
    id: "under-consruction",
    src: "/images/under-construction-920.jpg",
    alt: "Under Construction image",
  },
  notFound: {
    id: "not-found",
    src: "/images/404-error.jpg",
    alt: "Not Found image",
  },
};

app.use((err, req, res, next) => {
  console.log("app.js error message: ", err);

  const { statusCode = 500, message = "Something went wrong", navbar } = err;

  console.log("status code: ", statusCode);
  if (req.isAuthenticated()) {
    if (statusCode === 503) {
      return res
        .status(statusCode)
        .render("templates/errors/signedin-error-template", {
          statusCode,
          message,
          navbar,
          error: errorImages.underConstruction,
        });
    } else if (statusCode >= 500) {
      return res
        .status(statusCode)
        .render("templates/errors/signedin-error-template", {
          statusCode,
          message: "Wooops! Something went wrong",
          navbar: "none",
        });
    } else if (statusCode === 404) {
      return res
        .status(statusCode)
        .render("templates/errors/signedin-error-template", {
          statusCode,
          message: "Wooops! Page not found",
          navbar: navbar,
          error: errorImages.notFound,
        });
    }
    res.status(statusCode).render("templates/errors/signedin-error-template", {
      statusCode,
      message,
      navbar: "none",
    });
  } else {
    if (statusCode === 409) {
      req.flash("error", message);
      return res.redirect("/api/v1/auth/register");
    } else {
      res
        .status(statusCode)
        .render("templates/errors/signedout-error-template", {
          statusCode,
          message,
          navbar,
        });
    }
  }
});

module.exports = app;
