const router = require("express").Router();
const isLoggedIn = require("../../middleware/isLoggedIn");
const Playlist = require("../../models/Playlist.model");
const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

router.get("/new-playlist", isLoggedIn, (req, res, next) => {
  res.render("user/new-playlist.hbs", { user: { playlistname: "" } });
});

router.get("/new-playlist", isLoggedIn, (req, res, next) => {
  Playlist.create()
    .then(() => {
      res.render("user/my-playlist.hbs");
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/new-playlist", isLoggedIn, (req, res, next) => {
  const { newplaylist } = req.body;
  const userId = req.user._id;
  Playlist.create({
    userId: userId,
    playlistname: newplaylist,
  })
    .then(() => {
      res.redirect("../profile");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/edit-playlist/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Playlist.findById(id)
    .then((playlist) => {
      if (playlist.tracks && playlist.tracks.length > 0) {
        spotifyApi.getTracks(playlist.tracks).then((tracks) => {
          console.log(tracks.body.tracks[0]);
          res.render("user/edit-playlist", {
            playlist: playlist,
            tracks: tracks.body.tracks,
          });
        });
      } else {
        res.render("user/edit-playlist", {
          playlist: playlist,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  Playlist.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id/update", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Playlist.findById(id).then((playlist) => {
    res.render("user/update-form", { playlist });
  });
});

router.post("/:id/update-data", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Playlist.findByIdAndUpdate(id, { playlistname: req.body.name }, { new: true })
    .then((response) => {
      res.redirect(`/playlist/${id}/update`);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/add-track", isLoggedIn, (req, res, next) => {
  const { playlistId, trackId } = req.body;
  Playlist.findByIdAndUpdate(playlistId, {
    $push: { tracks: { $each: [trackId] } },
  })
    .then(() => {})
    .catch((err) => {
      next(err);
    });
});

router.post("/remove-track", isLoggedIn, (req, res, next) => {
  const { playlistId, trackId } = req.body;
  Playlist.findByIdAndUpdate(playlistId, {
    $pull: { tracks: trackId },
  })
    .then(() => {
      res.redirect(`edit-playlist/${playlistId}`);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
