const express = require('express')
const router = express.Router()
const db = require('../db')


router.get("/", function(request, response){
    response.render("createPlaylist.hbs")
})

router.post("", function(request, response){

    const model = {
        username: request.session.user,
        userId: request.session.userId,
        email: request.session.userEmailadress,
        playlistname: request.body.playlistName
    }

    db.createPlaylist(model, function(error, playlistId){
        if(error){
            console.log("error router:" , error)
            response.render("createPlaylist.hbs")
        }else{
            console.log("createdPlaylist:", playlistId)
            response.redirect('../../account/overview');

        }
    })

    console.log(model);

})


router.get("/playlists", function(request, response){

    console.log("inside playlists");
    
    db.getAllPlaylists(function(error, playlists){
		
		if(error){
			console.log("ERROR" , error);
			
			const model = {
				errorOcurred: true
			}
			response.render("playlists.hbs", model)
			
		}else{
			
			const model = {
				playlists: playlists
			}
			console.log(model);
			response.render("playlists.hbs", model)
			
		}
		
	})
})

router.get("/playlist/:id", function(request, response){
    //todo: Retrieve songs
    const songs = ["Song 1", "Song 2", "song 3", "Song 12", "Song 23", "song 33"]

    response.render("playlist.hbs", songs)

})

router.post('/delete/:id', function(request, response){

    const playlistId = request.params.id
    console.log("body", playlistId);
    db.deletePlaylist(playlistId, function(error){
        if(0<error.length){
            console.log("error in deleteplaylist: ", error);
            response.redirect('../../account/overview');
        }else{
            response.redirect('../../account/overview');
        }
    })
})

module.exports = router