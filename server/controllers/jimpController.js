const Jimp = require("jimp");

const resizeImage = async (type, width, height) => {
  return await Jimp.read(type)
    .then(async (image) => {
      const img = image.resize(width, height);
      return img;
    })
    .catch((err) => {
      console.log("error in resizing");
      console.log(err);
    });
};

const createBlankCanvas = async (width, height) => {
  const canvas = await new Jimp(width, height, 0xfff, async (err, image) => {
    if (err) {
      console.log(err);
    }
    return image;
  });

  return canvas;
};

combineImagesIntoOne = async (imagesArray, blankCanvas, isBuffer) => {
  // Composite the resized images onto the blank image, convert it to a base ^$ and send it back to the client.
  const image = await Jimp.read(blankCanvas).then(async (image) => {
    let img;
    img = await image.composite(imagesArray[0], 0, 0);
    img = await image.composite(imagesArray[1], 0, 533.33);
    img = await image.composite(imagesArray[2], 0, 1066);

    if (!isBuffer) img = await image.getBase64Async(Jimp.MIME_PNG);
    if (isBuffer) img = await image.getBufferAsync(Jimp.MIME_PNG);

    return img;
  });

  return image;
};

const decodeBase64ImageToBuffer = (dataString) => {
  const newString = dataString.split(";base64,").pop();
  return new Buffer.from(newString, "base64");
};

exports.createCombinedBufferOrImage = async (
  images,
  isBuffer,
  finalWidth,
  finalHeight
) => {
  let finalImage;

  const head = decodeBase64ImageToBuffer(images.head);
  const body = decodeBase64ImageToBuffer(images.body);
  const legs = decodeBase64ImageToBuffer(images.legs);

  //! In one - set image sizes and then create a new whole iamge base on that size ... then we can do different sizes.

  // Resize images read to be made into  the new image
  const headResized = await resizeImage(head, finalWidth, finalHeight / 3);
  const bodyResized = await resizeImage(body, finalWidth, finalHeight / 3);
  const legsResized = await resizeImage(legs, finalWidth, finalHeight / 3);

  // Create a blank image to paste the new images
  const blankCanvas = await createBlankCanvas(900, 1595);

  if (!isBuffer) {
    finalImage = await combineImagesIntoOne(
      [headResized, bodyResized, legsResized],
      blankCanvas,
      isBuffer
    );
  }

  if (isBuffer) {
    finalImage = await combineImagesIntoOne(
      [headResized, bodyResized, legsResized],
      blankCanvas,
      isBuffer
    );
  }

  return finalImage;
};
