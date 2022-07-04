const router = require("express").Router();

const alert = require("alert");
const isLoggedIn = require("../../middleware/isLoggedIn");
const Playlist = require("../../models/Playlist.model");
const User = require("../../models/User.model");
const spotifyApi = require('../../app');


router.get('/playlists',(req, res)=>{
    
    
    spotifyApi
    .searchPlaylists()
    .then((allPlaylist) => {
        res.render('/playlists/list', {playlist: allPlaylist.data.results} )
    
    })
    .catch(err => console.log(err));
    
    
    
})

router.post("/add-favorite", isLoggedIn ,(req, res) =>{
const query = { name, status, species, gender, image, apiId } = req.body
const idToCheck = req.body.apiId;
    Playlist.find({apiId: idToCheck})
	.then (charArray => {
		//comprobar si ese apiId ya esta en db playlist
		if (charArray.length === 0) {
            Playlist
                .create(query)
                .then(result => {
                  User
                    .findByIdAndUpdate(req.user._id,{$push : {favorites : result._id}})
                    .then(()=>{
                        res.redirect("/playlists")
                    })
                })
                .catch(err => console.log(err))
        } else {
			User
            .findById(req.user._id)
            .then((user)=>{
                if (!user.favorites.includes(charArray[0]._id)){
                    User
                    .findByIdAndUpdate(req.user._id,{$push : {favorites : charArray[0]._id}})
                    .then(()=>{
                        res.redirect("/playlists")
                    })
                }else {
                    res.redirect("/playlists")
                }
            })
            .catch((err)=>{
            console.log(err)
            })
            
            
            
		}
	}) 
})


router.post("/delete-favorite",isLoggedIn,(req,res)=>{
    const {id} = req.body
    User.findByIdAndUpdate(req.user._id,{$pull : {favorites : id}})
    .then(()=>{
        res.redirect("/profile")
    })
    .catch(err => console.log(err))
})

/**
 * ---arrays
{ field: { $in: [ value1, value2, ..... , valueN ] } }
{ field: { $nin: [ value1, value2, ..... , valueN ] } }
{ field: { $all: [ value1, value2, ..... , valueN ] } }
 */

module.exports = router;