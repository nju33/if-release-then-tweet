const Twit = require('twit');

console.log(process.env)

const twit = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

module.exprots = (pkg, githubUrl) => {
  return new Promise((resolve, reject) => {
    twit.post(
      'statuses/update',
      {
        status: `${pkg.name}@${
          pkg.version
        }🎉 ${githubUrl} https://www.npmjs.com/package/${pkg.name}`,
      },
      (err, data, response) => {
        if (err) {
          return reject(err);
        }

        resolve({data, response});
      },
    );
  })
};
