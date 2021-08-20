const jimpController = require("../utils/jimpController");

const response = require("../utils/responses");
const catchAsync = require("../utils/catchAsync");
const tweet = require("../utils/tweet");

const imageService = require("../services/imageService");

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
  const userImages = imageService.getUsersImages(req, next);
  response.sendSuccessData(req, res, userImages);
});

exports.combineUserImages = catchAsync(async (req, res, next) => {
  if (!req.body) return;

  const found = await imageService.findByThreeIds(req.body);

  if (!found) {
    const newCombination = await imageService.uploadNewThreeSections(req.body);
    const combinedImage = await prepareImagesForTwitterAndSend(req.body);
    return;
  }

  return;
});

const prepareImagesForTwitterAndSend = catchAsync(async (images) => {
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
