const SectionModel = require("../models/SectionModel");
const ThreeSections = require("../models/ThreeSections");
const AppError = require("../utils/AppError.js");
const { v4: uuidv4 } = require("uuid");

exports.uploadNewSection = async (req) => {
  const section = new SectionModel();
  section.sectionID = uuidv4();
  section.sectionType = req.body.sectionType;
  section.displayName = req.body.displayName;
  section.username = req.body.username;
  section.imageString = req.body.imageString;
  section.date = req.body.submitDate;
  section.sectionType = req.body.sectionType;
  await section.save();

  return section;
};

exports.getRandomSection = async (req, next) => {
  const type = req.params.type;
  const found = await SectionModel.find({ sectionType: type });
  if (!found) return next(new AppError("Failed to get a section", 111));
  const count = found.length;
  const randomChoice = Math.floor(Math.random() * count);
  const choice = found[randomChoice];
  return choice;
};

exports.getSectionByID = async (req, next) => {
  const id = req.params.id;
  const found = await SectionModel.findOne({ sectionID: id });
  if (!found) return next(new AppError("Failed to get a section", 111));
  return found;
};

exports.getUsersImages = async (req, next) => {
  const username = req.body.data;
  if (!username) return new AppError("Couldnt find the user", 111);
  const images = await SectionModel.find({ username: username });
  if (!images || images.length === 0 || images == null)
    return next(new AppError("Couldnt find the users sections ", 111));

  const foundImages = images.splice(0, 3);
};

exports.findByThreeIds = async (data) => {
  const found = await ThreeSections.findOne({
    headID: data.headID,
    bodyID: data.bodyID,
    legsID: data.legsID,
  });

  return found;
};

exports.uploadNewThreeSections = async (data) => {
  // Create a full section on the database to check against in the future.
  const newSections = await new ThreeSections();
  newSections.displayNames = [
    data.headUsername,
    data.bodyUsername,
    data.legsUsername,
  ];

  newSections.headID = data.headID;
  newSections.bodyID = data.bodyID;
  newSections.legsID = data.legsID;
  await newSections.save();
  return newSections;
};
