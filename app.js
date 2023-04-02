const express = require('express');
const connection = require('./Database/Connection');
const User = require('./Models/User');

const app = express();
connection();

app.get('/', (req, res) => {
  res.send('Welcome to the Software Developer Assignment');
});

// User login request
app.post('/login', async (req, res) => {
  try {
    const isUserExist = await User.find({email: req.body.email});
    if (isUserExist) {
      if (isUserExist.password === req.body.password) {
        res
          .status(200)
          .send({message: 'User login successful', user: isUserExist});
      } else {
        res.status(400).send({message: 'Wrong password entered'});
      }
    } else {
      const response = await User(req.body).save();
      res.status(200).send({message:'User signup and login successful'})
    }
  } catch (error) {
    res.status(400).send({message: error.message, error});
  }
});

// User logout request


app.listen(8080, () => {
  console.log('App is runnig on http://localhost:8080');
});
