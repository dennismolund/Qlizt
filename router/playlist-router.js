const express = require('express')
const router = express.Router()
const db = require('../db')
const songs = require('../songs')

router.get("/", function(request, response){
    response.render("createPlaylist.hbs")
})

router.post("", function(request, response){

    var isPublic = 0
    
    if(request.body.checkbox) isPublic = 1

    const model = {
        username: request.session.user,
        userId: request.session.userId,
        playlistname: request.body.playlistName,
        isPublic
    }

    db.createPlaylist(model, function(error, playlistId){
        if(error){
            console.log("error router:" , error)
            response.render("createPlaylist.hbs")
        }else{
            
            response.redirect('../../account/overview');

        }
    })

})


router.get("/playlists", function(request, response){

    db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error){
            response.render("playlists.hbs")
        }else{
            //console.log("INSIDE ROUTER: " , playlistsFromDb);
        
            response.render("playlists.hbs", {playlists: playlistsFromDb})
        }
    })
    
})

router.get("/playlist/:id", function(request, response){
    
    const playlistId = request.params.id
    db.getSongsByPlaylistId(playlistId, function(error, songs){
        if(error){
            console.log("error in rotuer: getSongsByPlaylistId", error);
            response.render("playlist.hbs", songs)
        }else{
            
            response.render("playlist.hbs", {songs: songs, playlistId: playlistId})
        }
    })

})

router.post('/delete/:id', function(request, response){

    const playlistId = request.params.id
    
    db.deletePlaylist(playlistId, function(error){
        if(0<error.length){
            console.log("error in deleteplaylist: ", error);
            response.redirect('../../account/overview');
        }else{
            response.redirect('../../account/overview');
        }
    })
})

router.get("/songs", function(request, response){

    db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error){
            response.render("songs.hbs")
        }else{
            const model = {
                playlists: playlistsFromDb,
                songs
            }
            response.render("songs.hbs", model)
        }
    })
    
})

router.post("/addSongToPlaylist", function(request, response){

    
    const playlistId = request.body.playlistId
    const title = request.body.title
    const artist = request.body.artist
    
    
    db.addSongToPlaylist(playlistId, title, artist, function(error){
        if(error){
            console.log("error adding songs to playlist: ", error);
            response.redirect("/playlist/songs")
        }else{
            response.redirect("/playlist/songs")
        }
    })
})


router.post("/removeSongFromPlaylist/:id", function(request, response){

    const songId = request.params.id
    const playlistId = request.body.playlistId
    
    db.deleteSongFromPlaylist(songId, function(error){
        if(0<error.length){
            console.log("error in deleteplaylist: ", error);
            response.redirect('/playlist/playlist');
        }else{
            response.redirect('/playlist/playlist/' + playlistId);
        }
    })
})

module.exports = router