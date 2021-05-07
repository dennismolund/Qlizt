const express = require('express')
const router = express.Router()
const model = require('../../../model/playlist-repository')
const songs = require('../songs')
const {getSongs} = require('../../../graphDB')

console.log("getSongs", getSongs);
router.get("/overview", function(request, response){
    var filter = request.query.filter
    if(!filter || filter == 'all') filter = "all"

    model.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error) response.render("overview.hbs")
        else response.render("overview.hbs", {playlists: playlistsFromDb, filter: filter})
    })
})

router.get("/explore", function(request, response){
    model.getAllPlaylists(function(error, playlists){
		if(error) response.render("playlists.hbs", {model: {errorOcurred: true}})
        else response.render("explore.hbs", {playlists: playlists})
	})
})

router.get("/createPlaylist", function(request, response){
    response.render("createPlaylist.hbs")
})

router.post("/createPlaylist",function(request, response){
    var isPublic = 0

    if(request.body.checkbox) isPublic = 1
    const playlist = {
        username: request.session.user,
        userId: request.session.userId,
        playlistname: request.body.playlistName,
        isPublic
    }

    if(!playlist.playlistname) return response.render("createPlaylist.hbs", {error: "Playlist name can not be empty"})

    model.createPlaylist(playlist, function(error){
        if(error) response.render("createPlaylist.hbs", error)
        else response.redirect('../../playlist/overview');
    })
})

router.get("/playlists", function(request, response){
    model.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error) response.render("playlists.hbs")
        else response.render("playlists.hbs", {playlists: playlistsFromDb})
    })
})


router.post('/delete/:id', function(request, response){
    const playlistId = request.params.id
    model.deletePlaylist(playlistId, function(error){
        if(error) response.redirect('../../playlist/overview');
        else response.redirect('../../playlist/overview');
    })
})

router.post("/removeSongFromPlaylist/:id", function(request, response){
    const songId = request.params.id
    const playlistId = request.body.playlistId
    
    model.deleteSongFromPlaylist(songId, function(error){
        if(error) response.redirect('/playlist/playlist');
        else response.redirect('/playlist/playlist/' + playlistId);
    })
})

router.post('/update/:id', function(request, response){
    const playlistId = request.params.id
    const playlistName = request.body.playlistName
    var isPublic = request.body.checkbox

    if(isPublic) isPublic = 1
    if(!isPublic) isPublic = 0

    if(!playlistName) return response.redirect('../../playlist/overview')
    model.updatePlaylist(playlistName,playlistId, isPublic, function(error){
        if(error) response.redirect('../../playlist/overview');
        else response.redirect('../../playlist/overview');
    })
})

router.get('/update/:id', function(request, response){
    const playlistId = request.params.id
    const isPublic = request.query.isPublic
    console.log("is public in gET", isPublic);
    response.render('update-playlist.hbs', {playlistId, isPublic})
})




router.get("/songs/:page", paginatedResults(songs), function(request, response){
    var searchWord = request.query.filter

    if(searchWord){
        var results = []
        songs.forEach(element => {
            if(element.title.substring(0, searchWord.length).toLowerCase() == searchWord.toLowerCase()) results.push(element)
        })
        const searchResults = {results: results}

        model.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
            if(error) response.render("songs.hbs", error)
            else response.render("songs.hbs", {playlists: playlistsFromDb, songs: searchResults, page: request.params.page}) 
        })
    }
    else{
        model.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
            if(error) response.render("songs.hbs", error)
            else response.render("songs.hbs", {playlists: playlistsFromDb, songs: request.paginatedResults, page: request.params.page})
        })
    }
})

module.exports = router

function paginatedResults(model){
    console.log("inside paginated", model);

    return function(request, response, next){
        var page = parseInt(request.params.page)
        const limit = 5

        const results = {}

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        results.results = model.slice(startIndex, endIndex)
        request.paginatedResults = results
        next()
    }
}

