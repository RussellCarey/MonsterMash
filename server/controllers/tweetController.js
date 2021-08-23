const twit = require("twit");
const catchAsync = require("../utils/catchAsync");

const Twitter = new twit({
  consumer_key: process.env.CONSUMER_API,
  consumer_secret: process.env.CONSUMER_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

const postImageTweet = catchAsync(async (image, data) => {
  // Upload a base 64 image first to the database
  const newMediaPost = await Twitter.post("media/upload", {
    media_data: image,
  });

  if (!newMediaPost) return;

  // Get the string ID of that image once returned
  const dataMediaString = newMediaPost.data.media_id_string;

  // Post status with connection to the image uploaded
  const fullPost = await Twitter.post("statuses/update", {
    status: `Wow what a masterpeice! Head by @${data.headUsername}, Body by @${data.bodyUsername} and Legs by @${data.legsUsername}! Check out more monsters and create your own at {url here}.`,
    media_ids: [dataMediaString],
  });
});

exports.uploadBaseImageToTwitter = (finalImage64, data) => {
  const twitterPost = postImageTweet(
    finalImage64.split(";base64,").pop(),
    data
  );
};
