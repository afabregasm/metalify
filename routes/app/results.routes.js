const router = require("express").Router();
const mongoose = require("mongoose");
const Playlist = require("../../models/Playlist.model");
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
    const savedPlaylists = await Playlist.find();
    const albums = await spotifyApi.getArtistAlbums(id);
    const albumsArray = albums.body.items;
    for (const album of albumsArray) {
      const idAlbum = album.id;
      const songs = await spotifyApi.getAlbumTracks(idAlbum);
      const cleanedSongs = songs.body.items.map((song) => {
        return { ...song, savedPlaylists };
      });
      finArray.push({ ...album, cleanedSongs });
    }
    res.render("search/single-artist.hbs", {
      albums: finArray,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/album/:id", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  try {
    const savedPlaylists = await Playlist.find();
    const album = await spotifyApi.getAlbum(id);
    const albumContent = album.body;
    albumContent.tracks.items = albumContent.tracks.items.map((item) => {
      return { ...item, savedPlaylists };
    });
    res.render("search/single-album.hbs", {
      album: albumContent,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
