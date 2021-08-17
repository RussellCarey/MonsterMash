const twit = require("twit");

const Twitter = new twit({
  consumer_key: process.env.CONSUMER_API,
  consumer_secret: process.env.CONSUMER_SECRET_KEY,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

exports.postImageTweet = async (image) => {
  console.log("running twtiter poster");
  try {
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
    response.sendFailedStatus(req, res, error);
  }
};
