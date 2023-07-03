const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first Name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last Name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter your phone number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password should be more than 6 characters"],
  },
});

// Fire a function before a doc is saved to db
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Add matchPassword method to our schema
UserSchema.methods.matchPassword = async (password, hash) => {
  console.log(this.password);
  return await bcrypt.compare(password, hash);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
