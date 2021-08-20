const UserModel = require("../models/UserModel");

exports.findOneUser = async (userData) => {
  //! Check if user exists - if they do skip - if not add to the database
  const found = await UserModel.findOne({ email: userData.email });
  return found;
};

exports.createNewUser = async (userData) => {
  const newUser = await new UserModel();
  newUser.username = userData.username;
  newUser.displayName = userData.displayName;
  newUser.email = userData.email;
  newUser.profileImage = userData.profileImage;
  await newUser.save();

  return newUser;
};
