const SectionModel = require("../models/SectionModel");
const ThreeSections = require("../models/ThreeSections");
const twit = require("twit");
const Jimp = require("jimp");

const { v4: uuidv4, stringify } = require("uuid");

const sendSuccessData = (req, res, data) => {
  res.json({
    status: "success",
    data: data,
  });
};

const sendFailedStatus = (req, res, error, data) => {
  console.dir(error || "Error occured");
  res.json({
    status: "failed",
  });
};

// Upload users single section to the database..
exports.uploadSection = async (req, res, next) => {
  console.log("Running upload section");

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

    sendSuccessData(req, res, section.sectionID);
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};

exports.getRandomSection = async (req, res, next) => {
  console.log("Running get randomimages");

  const type = req.params.type;

  try {
    const found = await SectionModel.find({ sectionType: type });
    if (!found) sendFailedStatus(req, res);
    const count = found.length;
    const randomChoice = Math.floor(Math.random() * count);
    const choice = found[randomChoice];

    sendSuccessData(req, res, choice);
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};

exports.getSection = async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  try {
    const found = await SectionModel.findOne({ sectionID: id });

    if (!found) {
      sendFailedStatus(req, res);
    } else {
      sendSuccessData(req, res, found);
    }
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};

//! Check if we are logged in on a protected page.
exports.getUserImages = async (req, res, next) => {
  console.log("Running get user iamges");
  const username = req.body.data;
  if (!username) sendFailedStatus(req, res);

  try {
    const images = await SectionModel.find({ username: username });
    const foundImages = images.splice(0, 3);

    if (foundImages.length === 0) {
      sendSuccessData(req, res, null);
    } else {
      sendSuccessData(req, res, foundImages);
    }
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};

//! Combine iamges into one image and then send using TWIT to twitter
exports.combineUserImages = async (req, res, next) => {
  try {
    const data = req.body;
    if (!data) return;

    // Create combined im age to send back to the browser
    const combinedImage = await combineImagesIntoOne(req.body);

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
      console.log("saving model");
      await Model.save();

      // CHeck if current combination exists - if it does skip - if not save and send to twitter..
      const tweet = postImageTweet(combinedImage.split(";base64,").pop());
    }

    sendSuccessData(req, res, combinedImage);
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};

//? Combine
const combineImagesIntoOne = async (images) => {
  const decodeBase64Image = (dataString) => {
    const newString = dataString.split(";base64,").pop();
    return new Buffer.from(newString, "base64");
  };

  const resizeImage = async (type) => {
    return await Jimp.read(type)
      .then(async (image) => {
        const img = image.resize(400, 255);
        return img;
      })
      .catch((err) => {
        console.log("error in resizing");
        console.log(err);
      });
  };

  const head = decodeBase64Image(images.head);
  const body = decodeBase64Image(images.body);
  const legs = decodeBase64Image(images.legs);

  // Resize images read to be made into  the new image
  const headResized = await resizeImage(head);
  const bodyResized = await resizeImage(body);
  const legsResized = await resizeImage(legs);

  // Create a blank image to paste the new images
  const blankCanvas = await new Jimp(400, 675, 0xfff, async (err, image) => {
    if (err) {
      console.log("COMPOSITE ERROR");
      console.log(err);
    }
    return image;
  });

  // Composite the resized images onto the blank image, convert it to a base ^$ and send it back to the client.
  const final = await Jimp.read(blankCanvas).then(async (image) => {
    console.log("Trying to composite image");
    let img;
    img = await image.composite(headResized, 0, 0);
    img = await image.composite(bodyResized, 0, 225);
    img = await image.composite(legsResized, 0, 450);
    img = await image.getBase64Async(Jimp.MIME_PNG);

    return img;
  });

  return final;
};

//? Post image
postImageTweet = async (image) => {
  try {
    const Twitter = new twit({
      consumer_key: process.env.CONSUMER_API,
      consumer_secret: process.env.CONSUMER_SECRET_KEY,
      access_token: process.env.ACCESS_TOKEN,
      access_token_secret: process.env.ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    });

    await Twitter.post(
      "media/upload",
      {
        media_data: image,
      },
      async function (err, data, response) {
        if (err) return console.log(err);

        const string = data.media_id_string;
        await Twitter.post(
          "statuses/update",
          {
            status: `Created and sent from my in progress monster making game. Testing 123!`,
            media_ids: [string],
          },
          async function (err, data, response) {
            if (!err) {
              console.log("worked");
            }
            if (err) {
              console.log("didnt work");
              console.log(err);
            }
          }
        );
      }
    );
  } catch (error) {
    sendFailedStatus(req, res, error);
  }
};
