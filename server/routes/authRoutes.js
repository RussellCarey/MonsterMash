const express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
const router = express.Router();
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    failureRedirect: "/twitter/failed",
  }),
  authController.checkTwitterIsLoggedIn,
  authController.onTwitterCallback
);

router.get("/twitter/failed", (req, res) => {
  res.send("FAILED TO LOGIN");
});

router.get(
  "/twitter/isloggedin",
  authController.checkJWTAndSetUser,
  authController.checkUserLoggedIn
);

router.get("/logout", authController.logout);

module.exports = router;
