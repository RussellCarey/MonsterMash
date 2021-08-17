const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const globalErrorHandler = require("./controllers/errorController");
require("./controllers/twitterAuthController");

const app = express();

app.use(cookieParser());

app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    credentials: true, // allow session cookie from browser to pass through
  })
);

const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");

//? Notes
//? This limiter will limit an IPs amount of times it can make a request per window if time.
const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message:
    "You have made too many requests from this IP. Please try again in 60 minutes.",
});

// //? Setting some misc useful headers - check doc for more options
// app.use(helmet());

// //? Limit request
// app.use("/api", limiter);

// //? Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false, limit: "20mb" }));

// //? Data sanitization against NoSQL query injects - checks body etc and filter out dollar signs and dots - removes mongo db operators
// app.use(mongoSanitize());

// //? Data sanitization against Cross site scripting attack - Clean any user input for malicious HTML code
// app.use(xss());

//! Create a route 'URL base' that the routes use
// app.use("/api/users", userRoutes);
app.use("/api/section", imageRoutes);
app.use("/api/auth", authRoutes);
app.use(globalErrorHandler);

app.listen(process.env.DB_PORT || 2222, () => {
  console.log(process.env.NODE_ENV);
});

//! Mongo Connect
// Connect to mongo
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("CONNECTED to mongo")
);
