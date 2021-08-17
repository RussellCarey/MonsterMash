const SectionModel = require("../models/SectionModel");
const ThreeSections = require("../models/ThreeSections");
const twit = require("twit");
const Jimp = require("jimp");
const jimpController = require("./jimpController");

const { v4: uuidv4, stringify } = require("uuid");

const response = require("../utils/responses");
const tweet = require("../utils/tweet");

// Upload users single section to the database..
exports.uploadSection = async (req, res, next) => {
  try {
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
  } catch (error) {
    response.sendFailedStatus(req, res, error);
  }
};

exports.getRandomSection = async (req, res, next) => {
  const type = req.params.type;

  try {
    const found = await SectionModel.find({ sectionType: type });
    if (!found) response.sendFailedStatus(req, res);
    const count = found.length;
    const randomChoice = Math.floor(Math.random() * count);
    const choice = found[randomChoice];

    response.sendSuccessData(req, res, choice);
  } catch (error) {
    response.sendFailedStatus(req, res, error);
  }
};

exports.getSection = async (req, res, next) => {
  const id = req.params.id;
  try {
    const found = await SectionModel.findOne({ sectionID: id });

    if (!found) {
      response.sendFailedStatus(req, res);
    } else {
      response.sendSuccessData(req, res, found);
    }
  } catch (error) {
    response.sendFailedStatus(req, res, error);
  }
};

//! Check if we are logged in on a protected page.
exports.getUserImages = async (req, res, next) => {
  const username = req.body.data;
  if (!username) response.sendFailedStatus(req, res);

  try {
    const images = await SectionModel.find({ username: username });
    const foundImages = images.splice(0, 3);

    if (foundImages.length === 0) {
      response.sendSuccessData(req, res, null);
    } else {
      response.sendSuccessData(req, res, foundImages);
    }
  } catch (error) {
    response.sendFailedStatus(req, res, error);
  }
};

//! Combine iamges into one image and then send using TWIT to twitter
exports.combineUserImages = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data) return;

    // Create combined im age to send back to the browser
    const combinedImage = await prepareImagesForTwitter(req.body);

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

      const twitterPost = tweet.postImageTweet(
        combinedImage.split(";base64,").pop()
      );
    }

    response.sendSuccessData(req, res, combinedImage);
  } catch (error) {
    response.sendFailedStatus(req, res, error);
  }
};

//? Combine
const prepareImagesForTwitter = async (images) => {
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

  return finalImage;
};
