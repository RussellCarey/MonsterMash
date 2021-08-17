const mongoose = require("mongoose");

const SectionModel = new mongoose.Schema({
  displayName: {
    type: String,
  },
  username: {
    type: String,
  },
  imageString: {
    type: String,
    required: [true, "Image string is empty."],
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  sectionID: {
    type: String,
  },
  sectionType: {
    type: String,
  },
});

const Section = mongoose.model("Section", SectionModel);
module.exports = Section;
