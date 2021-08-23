const mongoose = require("mongoose");

const ThreeSectionsModel = new mongoose.Schema({
  displayNames: {
    type: Array,
  },
  headID: {
    type: String,
  },
  bodyID: {
    type: String,
  },
  legsID: {
    type: String,
  },
  imageURL: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  usersLiked: {
    type: Array,
  },
  isLiked: {
    type: Boolean,
  },
});

const ThreeSections = mongoose.model("ThreeSections", ThreeSectionsModel);
module.exports = ThreeSections;
