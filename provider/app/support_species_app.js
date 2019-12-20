const express = require('express');

const app = express();

app.get('/plants', (req, res) => res.send('Hello World!'));

module.exports = app;
