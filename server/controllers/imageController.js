const response = require("../utils/responses");
const catchAsync = require("../utils/catchAsync");
const tweet = require("./tweetController");
const jimpController = require("./jimpController");
const imageService = require("../services/imageService");
const imageUploadController = require("../controllers/imageUploadController");

// Upload users single section to the database..
exports.uploadSection = catchAsync(async (req, res, next) => {
  const uploadedSection = await imageService.uploadNewSection(req, next);
  response.sendSuccessData(req, res, uploadedSection.sectionID);
});

exports.getRandomSection = catchAsync(async (req, res, next) => {
  const randomSection = await imageService.getRandomSection(req, next);
  response.sendSuccessData(req, res, randomSection);
});

exports.getSection = catchAsync(async (req, res, next) => {
  const section = await imageService.getSectionByID(req, next);
  response.sendSuccessData(req, res, section);
});

exports.getUserImages = catchAsync(async (req, res, next) => {
  const userImages = await imageService.getUsersImages(req, next);
  response.sendSuccessData(req, res, userImages);
});

exports.getRecentUploads = catchAsync(async (req, res, next) => {
  const recentImages = await imageService.getRecentCreations(req);
  response.sendSuccessData(req, res, recentImages);
});

// Combine sections one one and SUBMIT TO TWITTER..
exports.combineUserImages = catchAsync(async (req, res, next) => {
  if (!req.body) return;

  // Check if the combination create exists
  const found = await imageService.findByThreeIds(req.body);

  // If not create a new model and upload the image to the db and twitter.
  if (!found) {
    // Create an email that is a base 64 string for the twitter upload..
    const combinedImage64 = await jimpController.createCombinedBufferOrImage(
      req.body,
      false,
      900,
      1600
    );

    // Create a PNG to upload to the file server to use for the shite.
    const combinedImageBuffer = await jimpController.createCombinedBufferOrImage(
      req.body,
      true,
      900,
      1600
    );

    console.log(combinedImageBuffer);

    // Upload Image file to the space
    const imageUpload = await imageUploadController.uploadImage(
      combinedImageBuffer
    );

    // Upload this combination to the DB to check in the future..
    const newCombination = await imageService.uploadNewThreeSections(
      req.body,
      imageUpload
    );

    // Upload base 64 string from above to twitter.
    const twitterUpload = tweet.uploadBaseImageToTwitter(
      combinedImage64,
      req.body
    );
  }

  return;
});
