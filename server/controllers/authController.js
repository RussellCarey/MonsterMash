const jwt = require("jsonwebtoken");

const response = require("../utils/responses");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const authService = require("../services/authService");

exports.checkTwitterIsLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return next(new AppError("User not logged in", 302));
  }
};

exports.checkJWTAndSetUser = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return next(new AppError("Didnt find a token", 302));

  const data = await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new AppError("Failed in verifying token", 111));
    req.user = user;
    next();
  });
});

exports.onTwitterCallback = catchAsync(async (req, res) => {
  if (!req.user) return next(new AppError("Couldnt verify user", 111));

  const userObjectFromReq = {
    id: req.user.id,
    username: req.user.username,
    displayName: req.user.displayName,
    email: req.user.emails[0].value,
    profileImage: req.user.photos[0].value,
  };

  const foundUser = authService.findOneUser(userObjectFromReq);
  if (!foundUser) authService.createNewUser(userObjectFromReq);
  const token = await jwt.sign(userObjectFromReq, process.env.JWT_SECRET);

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
    response.sendSuccessData(req, res, req.user);
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

exports.checkJWTAndSetUser = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) next();

  const data = await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) res.json({ status: "failed" });
    req.user = user;

    next();
  });
};
