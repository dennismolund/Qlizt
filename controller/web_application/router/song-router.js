const express = require('express')
const router = express.Router()
const model = require('../../../model/song-repository')


router.get("/:id/:accountId/", function(request, response){
    const playlistName = request.query.playlistName
    const playlistId = request.params.id
    const ownerId = request.params.accountId
    var isOwner = false
    if(ownerId == request.session.userId) isOwner = true

    model.getSongsByPlaylistId(playlistId, function(error, songs){
        if(error) response.render("playlist.hbs", songs)
        else response.render("playlist.hbs", {songs, playlistId, isOwner, playlistName})
    })
})

router.post("/addSongToPlaylist", function(request, response){
    const playlistId = request.body.playlistId
    const title = request.body.title
    const artist = request.body.artist
    const page = request.body.page
    
    console.log(page);

    model.addSongToPlaylist(playlistId, title, artist, function(error){
        if(error) response.status(500).send(error)
        else response.status(204).send()
    })
})

router.post("/removeSongFromPlaylist/:id", function(request, response){

    const songId = request.params.id
    const playlistId = request.body.playlistId
    const userId = request.session.userId
    
    model.deleteSongFromPlaylist(songId, function(error){
        if(error) response.redirect('/song');
        else response.redirect('/song/' + playlistId + '/' + userId);
    })
})

module.exports = router
