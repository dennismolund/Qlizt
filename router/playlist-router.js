const express = require('express')
const router = express.Router()
const db = require('../data-access/playlist-repository')
const songs = require('../songs')


router.get("/overview", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")

    var filter = request.query.filter
    if(!filter) filter = "public"

    db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error){
            response.render("overview.hbs")
        }else{
            var playlistIsPublic = []
            var playlistIsPrivate = []
            playlistsFromDb.forEach(playlist =>{
                if(playlist.isPublic == 0) {
                    playlistIsPrivate.push(playlist)
                }
                else playlistIsPublic.push(playlist)
            })
            response.render("overview.hbs", {publicPlaylists: playlistIsPublic, privatePlaylists: playlistIsPrivate, filter})
        }
    })

})

router.get("/explore", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")

    db.getAllPlaylists(function(error, playlists){
		
		if(error){
			console.log("ERROR" , error);
			
			const model = {
				errorOcurred: true
			}
			response.render("playlists.hbs", model)
			
		}else{
            playlists.forEach(playlists => {
                if(playlists.isPublic == 0){
                    playlists.isPublic = false
                }else{
                    playlists.isPublic = true
                }
            })
            const model = {
                playlists: playlists
            }
			response.render("explore.hbs", model)
		}
	})
})

router.get("/createPlaylist", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    response.render("createPlaylist.hbs")
})

router.post("/createPlaylist", function(request, response){
    var isPublic = 0

    if(request.body.checkbox) isPublic = 1
    const model = {
        username: request.session.user,
        userId: request.session.userId,
        playlistname: request.body.playlistName,
        isPublic
    }

    if(!model.playlistname) return response.render("createPlaylist.hbs", {error: "Playlist name can not be empty"})

    db.createPlaylist(model, function(error, playlistId){
        if(error){
            console.log("error router:" , error)
            response.render("createPlaylist.hbs")
        }else{
            response.redirect('../../playlist/overview');
        }
    })
})

router.get("/playlists", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error){
            response.render("playlists.hbs")
        }else{
            //console.log("INSIDE ROUTER: " , playlistsFromDb);
            response.render("playlists.hbs", {playlists: playlistsFromDb})
        }
    })
    
})


router.post('/delete/:id', function(request, response){

    const playlistId = request.params.id
    
    db.deletePlaylist(playlistId, function(error){
        if(error){
            console.log("error in deleteplaylist: ", error);
            response.redirect('../../playlist/overview');
        }else{
            response.redirect('../../playlist/overview');
        }
    })
})

router.post("/removeSongFromPlaylist/:id", function(request, response){

    const songId = request.params.id
    const playlistId = request.body.playlistId
    
    db.deleteSongFromPlaylist(songId, function(error){
        if(error){
            console.log("error in deleteplaylist: ", error);
            response.redirect('/playlist/playlist');
        }else{
            response.redirect('/playlist/playlist/' + playlistId);
        }
    })
})

router.post('/update/:id', function(request, response){

    const playlistId = request.params.id
    const playlistName = request.body.playlistName
    var isPublic = request.body.checkbox

    if(isPublic) isPublic = 1
    if(!isPublic) isPublic = 0

    if(!playlistName) {
        return response.redirect('../../playlist/overview');
    }
    db.updatePlaylist(playlistName,playlistId, isPublic, function(error){
        if(error){
            console.log("error in deleteplaylist: ", error);
            response.redirect('../../playlist/overview');
        }else{
            response.redirect('../../playlist/overview');
        }
    })
})

router.get('/update/:id', function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    const playlistId = request.params.id
    const isPublic = request.query.isPublic
    console.log("is public in gET", isPublic);
    response.render('update-playlist.hbs', {playlistId, isPublic})
})




router.get("/songs/:page", paginatedResults(songs.songs), function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    var filter = request.query.filter

    if(filter){
        var results = []
        console.log(filter);
        songs.songs.forEach(element => {
            if(element.title.substring(0, filter.length).toLowerCase() == filter.toLowerCase()){ 
                results.push(element)
            }
        })
        const searchResults = {results: results}

        db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
            if(error){
                response.render("songs.hbs")
            }else{
                const model = {
                    playlists: playlistsFromDb,
                    songs: searchResults,
                    page: request.params.page
                }

                console.log(model.songs);
                response.render("songs.hbs", model)
            }
        })
    }
    
    else{
        db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
            if(error){
                response.render("songs.hbs")
            }else{
                const model = {
                    playlists: playlistsFromDb,
                    songs: request.paginatedResults,
                    page: request.params.page
                }
                console.log(model.songs);
                response.render("songs.hbs", model)
            }
        })
    }
})



module.exports = router


function paginatedResults(model){
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
