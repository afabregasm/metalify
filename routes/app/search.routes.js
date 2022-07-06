const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../models/User.model");
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

router.post("/results", async (req, res, next) => {
  const { value, type } = req.body;
  if (type === "song") {
    try {
      const track = await spotifyApi.searchTracks(value);
      const idArtist = track.body.tracks.items[0].album.artists[0].id;
      const getGenre = await spotifyApi.getArtist(idArtist);
      const genre = getGenre.body.genres;
      let stringGenre = genre.join(" ");
      if (stringGenre.includes("metal")) {
        res.render("search/tracks.hbs", { track: track.body.tracks.items });
      } else {
        res.render("search/form.hbs", {
          errorMessage:
            "Error 404: Musical taste not found. Try with a true song.",
        });
      }
      console.log(
        "🚀 ~ file: search.routes.js ~ line 32 ~ router.post ~ genre",
        genre
      );
    } catch (error) {
      console.log(error);
    }
  } else if (type === "artist") {
    spotifyApi
      .searchArtists(value)
      .then((artist) => {
        const genre = artist.body.artists.items[0].genres;
        let stringGenre = genre.join(" ");
        if (stringGenre.includes("metal")) {
          res.render("search/artists.hbs", {
            artist: artist.body.artists.items,
          });
        } else {
          res.render("search/form.hbs", {
            errorMessage:
              "Error 404: Musical taste not found. Try with a true musician.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.render("search/form.hbs", {
          errorMessage:
            "There was an error searching for the artist, make sure you provided a valid input.",
        });
      });
  }
});

module.exports = router;
