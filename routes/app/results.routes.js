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
    res.render("search/single-artist.hbs", { albums: finArray });
  } catch (error) {
    console.log(error);
  }
});

router.get("/album/:id", (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getAlbumTracks(id)
    .then((album) => {
      res.render("search/albums.hbs", { album: album.body.items });
      console.log(
        "🚀 ~ file: search.routes.js ~ line 84 ~ .then ~ album.body.items",
        album.body.items[0].artists
      );
    })
    .catch(() => {
      res.render("search/form.hbs", {
        errorMessage:
          "There was an error searching for the artist, make sure you provided a valid input.",
      });
    });
});

module.exports = router;
