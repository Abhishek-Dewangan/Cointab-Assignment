const express = require("express");
const cors = require("cors");
const connection = require("./Database/Connection");
const User = require("./Models/User");

const app = express();
connection();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to the Software Developer Assignment");
});

// User login request
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = Math.floor(Math.random() * (1000000 - 100000) + 100000);
    const isUserExist = await User.findOne({ email });
    console.log(isUserExist);
    if (isUserExist) {
      if (isUserExist.password === password) {
        isUserExist.token = token;
        await isUserExist.save();
        res
          .status(200)
          .send({ message: "User login successful", data: isUserExist });
      } else {
        console.log("wong");
        res.status(400).send({ message: "Wrong password entered" });
      }
    } else {
      const user = { email, password, token };
      const response = await User(user).save();
      res
        .status(200)
        .send({ message: "User signup and login successful", data: response });
    }
  } catch (error) {
    console.log("error");
    res.status(400).send({ message: error.message, error });
  }
});

// User logout request
app.post("/logout/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const { token } = req.body;
    const user = await User.findOne({ _id: userid, token });
    if (user) {
      user.token = "";
      await user.save();
      res.status(200).send({ message: "Logout successful" });
    } else {
      res.status(498).send({ message: "Invalid token" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message, error });
  }
});

app.listen(8080, () => {
  console.log("App is runnig on http://localhost:8080");
});
