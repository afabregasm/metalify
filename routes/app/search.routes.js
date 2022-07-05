const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../models/User.model");
const isLoggedOut = require("../../middleware/isLoggedOut");
const isLoggedIn = require("../../middleware/isLoggedIn");
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

// ROUTES

router.get("/", (req, res, next) => {
  res.render("search/form.hbs");
});

router.post("/results", (req, res, next) => {
  const { value, type } = req.body;
  if (type === "song") {
    spotifyApi
      .searchTracks(value)
      .then((track) => {
        res.render("search/tracks.hbs", { track: track.body.tracks.items });
        console.log(
          "AQUÍ EMPIEZAAAAAAA 👍👍👍👍👍👍👍",
          track.body.tracks.items[0].artists[0].name
        );
      })
      .catch((error) => {
        res.render("search/form.hbs", { errorMessage: error.message });
      });
  }
  //     .searchArtists(artist)
  //     .then((data) => {
  //       res.render("search/artists.hbs", {
  //         artist: data.body.artists.items,
  //       });
  //     })
  //     .catch((err) =>
  //       console.log("The error while searching artists occurred: ", err)
  //     );
});

// router.get("albums/:artistId", (req, res, next) => {
//   const { artistId } = req.params;
//   spotifyApi
//     .getArtistAlbums(artistId)
//     .then((data) => {
//       res.render("albums.hbs", { album: data.body.items });
//     })
//     .catch((err) =>
//       console.log(artistId, "The error while searching albums occurred: ", err)
//     );
// });

// router.get("tracks/:albumId", (req, res, next) => {
//   const { albumId } = req.params;
//   spotifyApi
//     .getAlbumTracks(albumId)
//     .then((data) => {
//       res.render("search/tracks.hbs", { track: data.body.items });
//     })
//     .catch((err) =>
//       console.log("The error while searching albums occurred: ", err)
//     );
// });

module.exports = router;
