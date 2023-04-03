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
    // console.log(isUserExist);
    if (isUserExist) {
      if (isUserExist.block_date) {
        const date = new Date().getTime();
        const blockDate = isUserExist.block_date.getTime();
        if (date >= blockDate) {
          isUserExist.block_date = "";
          isUserExist.wrong_login_attemps = 0;
          await isUserExist.save();
        }
      }
      if (isUserExist.wrong_login_attemps > 4) {
        // if (!isUserExist.block_date) {
        //   isUserExist.block_date = new Date(new Date().getTime() + 86400000);
        //   await isUserExist.save();
        // }
        res.status(400).send({
          message: `You have reached your maximum login failed attemps, you can login after ${isUserExist.block_date.toLocaleDateString()}, ${isUserExist.block_date.toLocaleTimeString()}`,
        });
      } else if (isUserExist.password === password) {
        isUserExist.token = token;
        isUserExist.block_date = "";
        isUserExist.wrong_login_attemps = 0;
        await isUserExist.save();
        res
          .status(200)
          .send({ message: "User login successful", data: isUserExist });
      } else {
        isUserExist.block_date = new Date(new Date().getTime() + 86400000);
        await isUserExist.save();
        isUserExist.wrong_login_attemps += 1;
        await isUserExist.save();
        res.status(400).send({
          message: `Wrong password entered, only ${
            5 - isUserExist.wrong_login_attemps
          } attemps left`,
        });
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
