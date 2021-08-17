const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// //? Sign up and login
// router.post("/signup", authController.signup);
// router.post("/login", authController.login);
// //? Notes
// //? Not posting or anything, just getting a new cookie so we can use get
// router.get("/logout", authController.logout);

// //? Password resetting
// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword", authController.resetPassword);

// //? Updating various user data
// router.patch(
//   "/updateMyPassword",
//   authController.protect,
//   authController.updatePassword
// );

// router.patch("/updateMe", authController.protect, userController.updateMe);

module.exports = router;
