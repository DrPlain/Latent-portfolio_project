const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local").Strategy;
const SECRET_KEY = "hxjbh6fghbjhsyf8yihbhvUTFUHVUv";
const maxAge = 3 * 24 * 60 * 60;

const User = require("../models/user");

class AuthController {
  static createToken(user) {
    return jwt.sign(user, SECRET_KEY, { expiresIn: maxAge });
  }

  static getLogin(req, res) {
    return res.json({ message: "Please enter your credentials" });
  }

  static JwtLogin(req, res) {
    const { username, password } = req.body;
    let user = null;
    for (const obj of Users) {
      if (obj.username === username) {
        user = obj;
        break;
      }
    }
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const accessToken = AuthController.createToken(user);
    res.cookie("jwt", accessToken, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    return res.status(200).json({ id: user.id });
  }

  static passportLogin(req, res) {
    res.status(200).json("Logged in successfully");
  }

  static logout(req, res) {
    const token = req.cookies.jwt;
    if (!token) return res.sendStatus(400);
    res.cookie("jwt", "", { maxAge: 1 });
    return res.sendStatus(200);
  }

  static initialize(passport) {
    async function authenticateUser(email, password, done) {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, {
          message: "There is no user with that email",
        });
      }
      try {
        const isMatch = await user.matchPassword(password, user.password);
        if (!isMatch)
          return done(null, false, { message: "Password incorrect" });
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }

    passport.use(
      new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        authenticateUser
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await User.findById(id);
      done(null, user);
    });
  }
}

module.exports = AuthController;
