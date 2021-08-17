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
});

const ThreeSections = mongoose.model("ThreeSections", ThreeSectionsModel);
module.exports = ThreeSections;
