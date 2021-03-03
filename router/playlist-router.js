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
            response.render("overview.hbs")

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

module.exports = router