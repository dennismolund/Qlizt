const express = require('express')
const db = require('../../data-access/playlist-repository')

const { authenticateToken } = require('../middleware/authenticateToken')

const router = express.Router()

//create playlist
router.post("/", authenticateToken, function(request, response){
	
	/*
		playlistname = xxxxx
		isPublic = 1
	*/

    const model = {
        username: request.idToken.preferred_username,
        userId: request.idToken.sub,
        playlistname: request.body.playlistname,
        isPublic: request.body.isPublic
    }

	console.log(model);

    db.createPlaylist(model, function(error, playlistId){
        if (error) {
			response.status(400).json({
				error: "invalid_grant"
			})
		} else {
			
			response.status(204).json("Created playist")
		}
        })
})


//get all playlists
router.get("/", authenticateToken, function(request, response){

	console.log("Token:", request.idToken);
	db.getAllPlaylists(function(error, playlists){
		if (error) {
			response.status(400).send({
				error: "invalid_grant"
			})
		} else response.status(200).json(playlists)
	})
})

module.exports = router