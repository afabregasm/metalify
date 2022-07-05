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
      })
      .catch(() => {
        res.render("search/form.hbs", {
          errorMessage:
            "There was an error searching for the song, make sure you provided a valid input.",
        });
      });
  } else if (type === "artist") {
    spotifyApi
      .searchArtists(value)
      .then((artist) => {
        res.render("search/artists.hbs", { artist: artist.body.artists.items });
      })
      .catch(() => {
        res.render("search/form.hbs", {
          errorMessage:
            "There was an error searching for the artist, make sure you provided a valid input.",
        });
      });
  }
});

router.get("/artist/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    //iniciamos array
    let finArray = [];
    //Llamamos api
    const albums = await spotifyApi.getArtistAlbums(id);
    //Cogemos los items de los albumes
    const albumsArray = albums.body.items;
    //Iteramos sobre los albumes para meter dentro las canciones
    for (const album of albumsArray) {
      const idAlbum = album.id;
      //obtenemos canciones del album actual
      const songs = await spotifyApi.getAlbumTracks(idAlbum);
      //cogemos los items de las canciones
      const cleanedSongs = songs.body.items;
      //pusheamos el nuevo objeto con las canciones dentro al array
      finArray.push({ ...album, cleanedSongs });
    }
    console.log(finArray[0].cleanedSongs[0]);
    // const info = [cleanedAlbum, cleanedSongs];
    res.render("search/single-artist.hbs", { albumes: finArray });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
