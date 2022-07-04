const router = require("express").Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const isLoggedOut = require("../../middleware/isLoggedOut");
const User = require("../../models/User.model");

router.get("/", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id)
  
    // .populate('favorites')
    .then((user) => {
      res.render("profile", { user: user });
    });
});

module.exports = router;
