const express = require("express");
const passport = require("passport");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const authController = require("../controllers/authController");

const router = express.Router();

const checkJWTAndSetUser = async (req, res, next) => {
  // Get cookie from header
  const token = req.headers.authorization;

  if (!token) next();

  // Verify
  const data = await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) res.json({ status: "failed" });
    req.user = user;

    next();
  });
};

// NO REQ RES ON IT
router.get("/twitter", passport.authenticate("twitter"));

//? On login completion.
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/twitter/failed",
  }),
  authController.checkTwitterIsLoggedIn,
  authController.onTwitterCallback
);

// Failed
router.get("/twitter/failed", (req, res) => {
  res.send("FAILED TO LOGIN");
});

router.get(
  "/twitter/isloggedin",
  checkJWTAndSetUser,
  authController.checkUserLoggedIn
);

router.get("/logout", authController.logout);

module.exports = router;
