const express = require('express')
const db = require('../../db')

const { authenticateToken } = require('../middleware/authenticateToken')

const router = express.Router()

router.get("/", authenticateToken, function(request, response){
    response.status(404).json("NOT FIXED YET")
})

router.post("/", authenticateToken, function(request, response){

    const playlistId = request.body.playlistId
    const title = request.body.title
    const artist = request.body.artist

    db.addSongToPlaylist(playlistId, title, artist, function(error){
        if (error) {
			response.status(400).json({
				"error": error
			})
		} else {
			response.status(200).json("added song to playlist")
		}
    })
})

module.exports = router