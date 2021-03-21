const express = require('express')
const db = require('../../db')

const { authenticateToken } = require('../middleware/authenticateToken')

const router = express.Router()



router.post("/", authenticateToken, function(request, response){
	
	/*
		username = mouliz
		userId = 1
		playlistname = xxxxx
		isPublic = 1
	*/

    const model = {
        username: request.body.username,
        userId: request.body.userId,
        playlistname: request.body.playlistname,
        isPublic: request.body.isPublic
    }

    db.createPlaylist(model, function(error, playlistId){
        if (error) {
			response.status(400).json({
				"error": error
			})
		} else {
			response.status(200).json("Created playist")
		}
        })
})


//get all playlists
router.get("/", authenticateToken, function(request, response){
	db.getAllPlaylists(function(error, playlists){
		if (error) {
			response.status(400).json({
				"error": error
			})
		} else {
			response.status(200).json(playlists)
		}
	})
})

module.exports = router