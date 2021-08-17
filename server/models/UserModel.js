const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a full name."],
  },
  displayName: {
    type: String,
    required: [true, "Please enter a username."],
  },
  email: {
    type: String,
    required: [true, "Please enter an email."],
    lowercase: true,
  },
  profileImage: {
    type: String,
  },
});

const User = mongoose.model("User", UserModel);

module.exports = User;
