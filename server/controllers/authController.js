const express = require("express");
const passport = require("passport");
const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");

exports.checkTwitterIsLoggedIn = (req, res, next) => {
  req.user ? next() : res.status(401);
};

exports.checkJWTAndSetUser = async (req, res, next) => {
  // Get cookie from header
  const token = req.headers.authorization;

  // Verify
  const data = await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) res.json({ status: "failed" });
    req.user = user;

    next();
  });
};

exports.onTwitterCallback = async function (req, res) {
  try {
    // sign req.user..
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
  } catch (error) {
    res.json({
      status: "failed",
      token: null,
    });
  }
};

exports.checkUserLoggedIn = async (req, res) => {
  if (req.user) {
    res.json({
      data: req.user,
      status: "success",
    });
  }

  if (!req.user) {
    res.json({
      status: "failed",
    });
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy(function () {
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    res.redirect("http://127.0.0.1:3000");
  });
};
