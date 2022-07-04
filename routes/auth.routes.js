const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const mongoose = require("mongoose");
const User = require("../models/User.model");
const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");

// LOGIN ROUTES

router.get("/", isLoggedOut, (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/login.hbs", {
      errorMessage: "Please provide your username.",
    });
  }

  if (!password) {
    return res.status(400).render("auth/login.hbs", {
      errorMessage: "Please provide your password.",
    });
  }

  if (!regex.test(password)) {
    return res.status(400).render("auth/login.hbs", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(400).render("auth/login.hbs", {
          errorMessage: "Wrong username, please try again.",
        });
      }

      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login.hbs", {
            errorMessage: "Wrong password, please try again.",
          });
        }
        req.session.user = user;
        return res.redirect("/profile");
      });
    })

    .catch((err) => {
      next(err);
      return res
        .status(500)
        .render("auth/login.hbs", { errorMessage: err.message });
    });
});

// LOGOUT ROUTE

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("logout-error.hbs");
    }
    res.redirect("/");
  });
});

// SIGNUP ROUTES

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/signup.hbs", {
      errorMessage: "Please provide your username.",
    });
  }

  if (!password) {
    return res.status(400).render("auth/signup.hbs", {
      errorMessage: "Please provide your password.",
    });
  }

  if (!regex.test(password)) {
    return res.status(400).render("auth/signup.hbs", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  User.findOne({ username }).then((found) => {
    if (found) {
      return res
        .status(400)
        .render("auth/signup.hbs", { errorMessage: "Username already taken." });
    }

    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        return User.create({
          username,
          password: hashedPassword,
        });
      })
      .then((user) => {
        req.session.user = user;
        res.redirect("/profile");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup.hbs", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res.status(400).render("auth/signup.hbs", {
            errorMessage:
              "Username need to be unique. The username you chose is already in use.",
          });
        }
        return res
          .status(500)
          .render("auth/signup.hbs", { errorMessage: error.message });
      });
  });
});

module.exports = router;
