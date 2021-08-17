const AppError = require("../utils/AppError");
const UserModel = require("../models/UserModel");

//? Notes
//? First create a blank object upload
//? Object keys converts the object to an ARRAY of its keys - then loop through each one --
//? if that element is included in the allowe fields then add it to the object.
const filterObject = (obj, ...allowedFields) => {
  const newObject = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObject[el] = obj[el];
    }
  });

  return newObject;
};

//? Notes
//? If the body containts the password, then return as this route is not for doing passwords, just data.
//? Sent a const using the function create above - pass in the body, and the allow fields that the USER IS ALLOWED TO CHANGE.
//? Use find by ID and update passing in first, the ID of the user to update, then the FIELDS to be updated -- run validators and return updated.
//? Response send the updated user.
exports.updateMe = async (req, res, next) => {
  try {
    // Create error if user POSTS password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates, please use updateMyPassword",
          400
        )
      );
    }

    // Update the user document - save() wont work as we need to supply all data fields. new: true returns updated object
    const filteredBody = filterObject(req.body, "name", "email");
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
      // send updated user
    });
  } catch (error) {
    console.log(error);
  }
};
