const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('<input type={text}/>');
});

app.listen(8080, () => {
  console.log('App is runnig on http://localhost:8080');
});
