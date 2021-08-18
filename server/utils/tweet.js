const twit = require("twit");
const catchAsync = require("../utils/catchAsync");

const Twitter = new twit({
  consumer_key: process.env.CONSUMER_API,
  consumer_secret: process.env.CONSUMER_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

exports.postImageTweet = catchAsync(async (image) => {
  // Upload a base 64 image first to the database
  const newMediaPost = await Twitter.post("media/upload", {
    media_data: image,
  });

  if (!newMediaPost) return;

  // Get the string ID of that image once returned
  const dataMediaString = newMediaPost.data.media_id_string;

  // Post status with connection to the image uploaded
  const fullPost = await Twitter.post("statuses/update", {
    status: `Created and sent from my in progress monster making game. Testing 123!`,
    media_ids: [dataMediaString],
  });
});
