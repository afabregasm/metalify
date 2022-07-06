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

router.get("/artist/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  try {
    let finArray = [];
    const albums = await spotifyApi.getArtistAlbums(id);
    const albumsArray = albums.body.items;
    for (const album of albumsArray) {
      const idAlbum = album.id;
      const songs = await spotifyApi.getAlbumTracks(idAlbum);
      const cleanedSongs = songs.body.items;
      finArray.push({ ...album, cleanedSongs });
    }
    res.render("search/single-artist.hbs", { albums: finArray });
  } catch (error) {
    next(error);
  }
});

router.get("/album/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  spotifyApi
    .getAlbum(id)
    .then((album) => {
      res.render("search/single-album.hbs", { album: album.body });
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
