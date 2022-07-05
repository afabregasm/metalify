const router = require("express").Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const isLoggedOut = require("../../middleware/isLoggedOut");
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");


router.get("/", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id)

    .populate('playlists')
    .then((user) => {
      res.render("user/profile.hbs", { user: user });
    });
});

module.exports = router;
