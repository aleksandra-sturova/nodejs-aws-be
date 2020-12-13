require('dotenv').config();
const express = require('express');
const axios = require('axios').default;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.all('/*', (req, res) => {
  console.log('Original URL: ', req.originalUrl);
  console.log('Method: ', req.method);
  console.log('Body: ', req.body);

  const recipient = req.originalUrl.split('/')[1];

  const recipientURL = process.env[recipient];
  console.log('Recipient URL: ', recipientURL);
  const filteredParams = req.originalUrl
    .split('/')
    .filter((item) => item !== recipient)
    .join('/');

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${filteredParams}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body }),
    };

    axios(axiosConfig)
      .then((response) => {
        console.log('Response: ', response.data);
        res.json(response.data);
      })
      .catch((error) => {
        console.log('Error: ', error);
        if (error.response) {
          const { status, data } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
