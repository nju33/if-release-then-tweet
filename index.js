const crypto = require('crypto');
const express = require('express');
const bodyParser = require('body-parser');
const ghGot = require('gh-got');
const getRawBody = require('raw-body');
const app = express();

const createSign = data => {
  return 'sha1=' + crypto.createHmac('sha1', process.env.GITHUB_WEBHOOK_SECRET).update(data).digest('hex')
}

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
  const buf = await getRawBody(req);
  const signature = req.headers['x-hub-signature'];
  if (typeof signature === 'undefined') {
    return;
  }

  const data = req.body;
  if (!/^v\d+\.\d+\.\d+$/.test(data.head_commit.message)) {
    return next();
  }

  const reponame = data.repository.full_name;
  const path = 'package.json';
  const version = data.head_commit.message.slice(1);

  try {
    const {body: pkg} = await ghGot(`repos/${reponame}/contents/package.json`, {
      token: process.env.TOKEN,
      headers: {
        Accept: 'application/vnd.github.v3.raw',
      },
    });

    await tweet(pkg, data.repository.html_url);
  } catch (err) {
    console.log(err);
  }
});

app.listen(32456, function() {
  console.log('Example app listening on port 32456!');
});
