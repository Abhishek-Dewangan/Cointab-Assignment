const express = require('express');
const connection = require('./Database/Connection');

const app = express();
connection();

app.get('/', (req, res) => {
  res.send('<input type={text}/>');
});

app.listen(8080, () => {
  console.log('App is runnig on http://localhost:8080');
});
