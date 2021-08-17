const Jimp = require("jimp");

exports.resizeImage = async (type) => {
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

exports.createBlankCanvas = async (width, height) => {
  const canvas = await new Jimp(width, height, 0xfff, async (err, image) => {
    if (err) {
      console.log(err);
    }
    return image;
  });

  return canvas;
};

exports.combineImagesIntoOne = async (imagesArray, blankCanvas) => {
  // Composite the resized images onto the blank image, convert it to a base ^$ and send it back to the client.
  const image = await Jimp.read(blankCanvas).then(async (image) => {
    console.log("Trying to composite image");
    let img;
    img = await image.composite(imagesArray[0], 0, 0);
    img = await image.composite(imagesArray[1], 0, 225);
    img = await image.composite(imagesArray[2], 0, 450);
    img = await image.getBase64Async(Jimp.MIME_PNG);

    return img;
  });

  return image;
};

exports.decodeBase64Image = (dataString) => {
  const newString = dataString.split(";base64,").pop();
  return new Buffer.from(newString, "base64");
};
