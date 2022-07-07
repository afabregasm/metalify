const router = require("express").Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");

router.get("/", isLoggedIn, (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    Playlist.find({ userId: req.user._id })
      .then((playlists) => {
        res.render("user/profile.hbs", { user: user, playlists: playlists });
      })
      .catch((err) => {
        next(err);
      });
  });
});

module.exports = router;
