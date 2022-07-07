const router = require("express").Router();
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");

router.get("/new-playlist", (req, res, next) => {
  res.render("user/new-playlist.hbs", { user: { playlistname: "" } });
});

router.get("/new-playlist", (req, res, next) => {
  Playlist.create()
    .then(() => {
      res.render("user/my-playlist.hbs");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/new-playlist", (req, res, next) => {
  const { newplaylist } = req.body;
  Playlist.create({
    playlistname: newplaylist,
  })
    .then((user) => {
      console.log(user);
      res.render("user/profile.hbs", {
        user: { playlistname: newplaylist },
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/my-playlist", (req, res, next) => {
  Playlist.find()
    .then((response) => {
      res.render("user/my-playlist.hbs", { response });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/my-playlist", (req, res, next) => {
  res.render("user/costume-playlist", { response });
});

router.get("/costume-playlist/:id", (req, res, next) => {
  const { id } = req.params;
  Playlist.findById(id)
    .then((playlist) => {
      res.render("user/costume-playlist", { playlist });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:id/delete", (req, res, next) => {
  Playlist.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id/update", (req, res, next) => {
  const { id } = req.params;
  Playlist.findById(id).then((playlist) => {
    res.render("user/update-form", { playlist });
  });
});

router.post("/:id/update-data", (req, res, next) => {
  const { id } = req.params;
  Playlist.findByIdAndUpdate(id, { playlistname: req.body.name }, { new: true })
    .then((response) => {
      res.redirect(`/playlist/${id}/update`);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/add-track", (req, res, next) => {
  const { playlistId, trackId } = req.body;
  Playlist.findByIdAndUpdate(playlistId, {
    $push: { tracks: { $each: [trackId] } },
  })
    .then(() => {})
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
