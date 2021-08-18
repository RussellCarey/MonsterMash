const express = require("express");
const passport = require("passport");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const response = require("../utils/responses");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.checkTwitterIsLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return next(new AppError("User not logged in", 302));
  }
};

exports.checkJWTAndSetUser = catchAsync(async (req, res, next) => {
  // Get cookie from header
  const token = req.headers.authorization;
  if (!token) return next(new AppError("Didnt find a token", 302));

  // Verify
  const data = await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new AppError("Failed in verifying token", 111));
    req.user = user;
    next();
  });
});

exports.onTwitterCallback = catchAsync(async (req, res) => {
  if (!req.user) return next(new AppError("Couldnt verify user", 111));

  const minifiedUser = {
    id: req.user.id,
    username: req.user.username,
    displayName: req.user.displayName,
    email: req.user.emails[0].value,
    profileImage: req.user.photos[0].value,
  };

  //! Check if user exists - if they do skip - if not add to the database
  const found = await UserModel.findOne({ email: minifiedUser.email });
  if (!found) {
    const newUser = await new UserModel();
    newUser.username = minifiedUser.username;
    newUser.displayName = minifiedUser.displayName;
    newUser.email = minifiedUser.email;
    newUser.profileImage = minifiedUser.profileImage;
    await newUser.save();
  }

  const token = await jwt.sign(minifiedUser, process.env.JWT_SECRET);

  // Successful authentication, redirect home.
  res.set("location", "http://127.0.0.1:3000");
  res
    .cookie("token", token, {
      httpOnly: false,
      secure: false,
    })
    .status(302)
    .json({
      token: token,
    });
});

exports.checkUserLoggedIn = catchAsync(async (req, res) => {
  if (req.user) {
    response.sendSuccessData(req.user);
  }

  if (!req.user) {
    return next(new AppError("User is not logged in", 302));
  }
});

exports.logout = (req, res, next) => {
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.redirect("http://127.0.0.1:3000");
  });
};
