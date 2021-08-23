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
  const images = await SectionModel.find({ username: username }).sort({
    date: -1,
  });
  if (!images || images.length === 0 || images == null) return [];

  const foundImages = images.splice(0, 3);
  return foundImages;
};

exports.getRecentCreations = async (req, next) => {
  // Find all complete items //! SKIP?
  const foundItems = await ThreeSections.find().sort({ date: -1 });

  // If not items return empty;
  if (!foundItems || foundItems.length === 0) return [];

  // Get first 6 items
  const clippedItems = foundItems.splice(0, 12);

  //! Attempt to intrduce a form a like function.
  // // Get current user
  // const currentUser = req.body.data;

  // // If user not logged in stop here and return the normal results
  // if (!currentUser || currentUser === "") return clippedItems;

  // // CHeck if any have been liked by the user, if so add that to the object sent to the browser to show.
  // const checkedLikes = clippedItems.map((img) => {
  //   if (img.usersLiked.includes(currentUser)) {
  //     img.isLiked = true;
  //   }
  //   return img;
  // });

  // Return
  return clippedItems;
};

exports.findByThreeIds = async (data) => {
  const found = await ThreeSections.findOne({
    headID: data.headID,
    bodyID: data.bodyID,
    legsID: data.legsID,
  });

  return found;
};

exports.uploadNewThreeSections = async (data, url) => {
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
  newSections.imageURL = url;
  await newSections.save();
  return newSections;
};
