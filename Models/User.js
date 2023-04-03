const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
  wrong_login_attemps: { type: Number, default: 0 },
});

module.exports = mongoose.model("user", UserSchema);
