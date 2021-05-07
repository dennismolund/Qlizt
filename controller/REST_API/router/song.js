const express = require('express')
const model = require('../../../model/song-repository')

const { authenticateToken } = require('../middleware/authenticateToken')

const router = express.Router()

//add song to playlist
router.post("/:id", authenticateToken, function(request, response){

    const playlistId = request.params.id
    const title = request.body.title
    const artist = request.body.artist

    model.addSongToPlaylist(playlistId, title, artist, function(error){
        if (error) {
			response.status(400).send({
				error: "invalid_grant" 
			})
		}else response.status(204).json("added song to playlist")
    })
})

module.exports = router