const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../../models/User.model");
const isLoggedOut = require("../../middleware/isLoggedOut");
const isLoggedIn = require("../../middleware/isLoggedIn");
const spotifyApi = require('../../app');



// Our routes go here:
router.get('/', (req, res, next) => {
    res.render('search-form.hbs')
})

router.get('/artist-search', (req, res, next) => {
    const { artist } = req.query
    spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render('artist-search-results.hbs', { artist: data.body.artists.items });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/albums/:artistId', (req, res, next) => {
    const { artistId } = req.params
    spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      res.render('albums.hbs', { album: data.body.items });
    })
    .catch(err => console.log(artistId, 'The error while searching albums occurred: ', err));
})

router.get('/tracks/:albumId', (req, res, next) => {
    const {albumId} = req.params
    console.log(albumId)
    spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
        res.render('view-tracks.hbs', {track: data.body.items})
    })
    .catch(err => console.log('The error while searching albums occurred: ', err));
})

module.exports = router;