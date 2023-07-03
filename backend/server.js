const express = require("express");
const cookieParser = require("cookie-parser");
const allRoutes = require("./routes/routes");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./controllers/AuthController").initialize;

const app = express();
initializePassport(passport);
const PORT = 3000;

// Users = [
//   {
//     id: 1,
//     username: "giddy",
//     passwordHash: "password1",
//   },
//   {
//     id: 2,
//     username: "buddy",
//     passwordHash: "password2",
//   },
// ];

mongoose
  .connect("mongodb://localhost/latent", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  })
  .catch((err) => console.log(err.message));

app.use(
  session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(allRoutes);
