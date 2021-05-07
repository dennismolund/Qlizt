const express = require('express')
const model = require('../../../model/playlist-repository')

const { authenticateToken } = require('../middleware/authenticateToken')

const router = express.Router()

//create playlist
router.post("/", authenticateToken, function(request, response){
    const playlist = {
        username: request.idToken.preferred_username,
        userId: request.idToken.sub,
        playlistname: request.body.playlistname,
        isPublic: request.body.isPublic
    }

    model.createPlaylist(playlist, function(error, playlistId){
        if (error) {
			response.status(400).json({
				error: "invalid_grant"
			})
		} else response.status(204).json("Created playist")
    })
})


//get all playlists
router.get("/", authenticateToken, function(request, response){
	model.getAllPlaylists(function(error, playlists){
		if (error) {
			response.status(400).send({
				error: "invalid_grant"
			})
		} else response.status(200).json(playlists)
	})
})

module.exports = router