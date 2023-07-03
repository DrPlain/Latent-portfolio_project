const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/AuthController");
const requireJwtAuth = require("../middlewares/requireJwtAuth");
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const UserController = require("../controllers/UserController");
const User = require("../models/user");

const router = express.Router();

router.get("/home", checkAuthenticated, (req, res) => {
  res.json({ message: "This page can only be accessed by logged in users" });
});

router.get("/login", AuthController.getLogin);
router.post(
  "/login",
  passport.authenticate("local"),
  AuthController.passportLogin
);
// router.post("/login", AuthController.postLogin);
router.get("/logout", AuthController.logout);
router.post("/user", UserController.createUser);
router.get("/users", checkAuthenticated, UserController.getAllUsers);

module.exports = router;
