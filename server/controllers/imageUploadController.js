const AWS = require("aws-sdk");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");

const s3Client = new AWS.S3({
  endpoint: "sgp1.digitaloceanspaces.com",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  ACL: "public-read",
});

let uploadParams = {
  Bucket: "droppyspace",
  Key: "",
  Body: "",
  ACL: "public-read",
};

exports.uploadImage = async (image) => {
  try {
    const uuid = uuidv4();
    uploadParams.Key = uuid;
    uploadParams.Body = image;
    uploadParams.ContentType = "image/png";

    await s3Client.upload(uploadParams, (err, data) => {
      if (err) {
        console.log("ERROR WITH IMAGE UPLOAD");
        console.log(err, err.stack);
        return;
      }
    });
    return uploadParams.Key;
  } catch (error) {
    console.log(error);
  }
};

// exports.deleteFileFromSpace = async (objectName) => {
//   try {
//     var params = { Bucket: "droppyfiles", Key: `${objectName}` };

//     s3Client.deleteObject(params, (err, data) => {
//       if (err) {
//         console.log(err, err.stack);
//         throw new Error();
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
