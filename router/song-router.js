const express = require('express')
const router = express.Router()
const db = require('../data-access/song-repository')

router.get("/:id/:userId", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    const playlistId = request.params.id
    const ownerId = request.params.userId
    var isOwner = false
    if(ownerId == request.session.userId) isOwner = true

    db.getSongsByPlaylistId(playlistId, function(error, songs){
        if(error){
            console.log("error in rotuer: getSongsByPlaylistId", error);
            response.render("playlist.hbs", songs)
        }else{
            response.render("playlist.hbs", {songs: songs, playlistId: playlistId, isOwner: isOwner})
        }
    })

})

router.post("/addSongToPlaylist", function(request, response){
    
    const playlistId = request.body.playlistId
    const title = request.body.title
    const artist = request.body.artist
    const page = request.body.page
    
    db.addSongToPlaylist(playlistId, title, artist, function(error){
        if(error){
            console.log("error adding songs to playlist: ", error);
            response.redirect("/playlist/songs")
        }else{
            response.redirect("/playlist/songs/"+page)
        }
    })
})

router.post("/removeSongFromPlaylist/:id", function(request, response){

    const songId = request.params.id
    const playlistId = request.body.playlistId
    const userId = request.session.userId
    
    db.deleteSongFromPlaylist(songId, function(error){
        if(error){
            console.log("error in deleteplaylist: ", error);
            response.redirect('/song');
        }else{
            response.redirect('/song/' + playlistId + '/' + userId);
        }
    })
})


module.exports = router
