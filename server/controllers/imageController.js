const SectionModel = require("../models/SectionModel");
const ThreeSections = require("../models/ThreeSections");
const jimpController = require("../utils/jimpController");
const AppError = require("../utils/AppError");
const { v4: uuidv4, stringify } = require("uuid");

const response = require("../utils/responses");
const catchAsync = require("../utils/catchAsync");
const tweet = require("../utils/tweet");

// Upload users single section to the database..
exports.uploadSection = catchAsync(async (req, res, next) => {
  const section = new SectionModel();
  section.sectionID = uuidv4();
  section.sectionType = req.body.sectionType;
  section.displayName = req.body.displayName;
  section.username = req.body.username;
  section.imageString = req.body.imageString;
  section.date = req.body.submitDate;
  section.sectionType = req.body.sectionType;
  await section.save();

  response.sendSuccessData(req, res, section.sectionID);
});

exports.getRandomSection = catchAsync(async (req, res, next) => {
  const type = req.params.type;

  const found = await SectionModel.find({ sectionType: type });
  if (!found) response.sendFailedStatus(req, res);
  const count = found.length;
  const randomChoice = Math.floor(Math.random() * count);
  const choice = found[randomChoice];

  response.sendSuccessData(req, res, choice);
});

exports.getSection = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const found = await SectionModel.findOne({ sectionID: id });
  if (!found) {
    return next(new AppError("Failed to get a section", 111));
  } else {
    response.sendSuccessData(req, res, found);
  }
});

//! Check if we are logged in on a protected page.
exports.getUserImages = catchAsync(async (req, res, next) => {
  const username = req.body.data;
  if (!username) return new AppError("Couldnt find the user", 111);

  const images = await SectionModel.find({ username: username });

  if (!images || images.length === 0 || images == null)
    return next(new AppError("Couldnt find the users sections ", 111));

  const foundImages = images.splice(0, 3);

  response.sendSuccessData(req, res, foundImages);
});

//! Combine iamges into one image and then send using TWIT to twitter
exports.combineUserImages = catchAsync(async (req, res, next) => {
  let combinedImage;

  // If this fails no response is needed to for the user
  const data = req.body;
  if (!data) return;

  // Check if the combination of these 3 exact iamges
  const found = await ThreeSections.findOne({
    headID: data.headID,
    headID: data.bodyID,
    headID: data.legsID,
  });

  // If nothing is found then create a new version on the database and upload the tweet
  if (!found) {
    // Create a full section on the database to check against in the future.
    const Model = await new ThreeSections();
    Model.displayNames = [
      data.headUsername,
      data.bodyUsername,
      data.legsUsername,
    ];

    Model.headID = data.headID;
    Model.bodyID = data.bodyID;
    Model.legsID = data.legsID;
    await Model.save();

    // Create combined im age to send back to the browser
    combinedImage = await prepareImagesForTwitter(req.body);
  }

  response.sendSuccessData(req, res, combinedImage);
});

//? Combine
const prepareImagesForTwitter = catchAsync(async (images) => {
  const head = jimpController.decodeBase64Image(images.head);
  const body = jimpController.decodeBase64Image(images.body);
  const legs = jimpController.decodeBase64Image(images.legs);

  // Resize images read to be made into  the new image
  const headResized = await jimpController.resizeImage(head);
  const bodyResized = await jimpController.resizeImage(body);
  const legsResized = await jimpController.resizeImage(legs);

  // Create a blank image to paste the new images
  const blankCanvas = await jimpController.createBlankCanvas(400, 675);

  const finalImage = await jimpController.combineImagesIntoOne(
    [headResized, bodyResized, legsResized],
    blankCanvas
  );

  const twitterPost = await tweet.postImageTweet(
    finalImage.split(";base64,").pop()
  );

  return finalImage;
});
