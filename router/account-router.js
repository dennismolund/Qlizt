const express = require('express')
const db = require('../db')
var bcrypt = require('bcryptjs');
const saltRounds = 10;

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})

router.get("/overview", function(request, response){

    db.getPlaylistByUserId(request.session.userId, function(error, playlistsFromDb){
        if(error){
            response.render("overview.hbs")
        }else{
            console.log("INSIDE ROUTER: " , playlistsFromDb);
        
            response.render("overview.hbs", {playlists: playlistsFromDb})
        }
    })

})

router.get("/signup", function(request, response){
    response.render("signup.hbs")
})

router.post("/login", function(request, response){
    const account = {
        enteredUsername: request.body.username,
        enteredPassword: request.body.password,
    }

    if(account.enteredUsername.length == 0 || account.enteredPassword.length == 0){
        response.render("login.hbs")
    }else{
        db.getAccountByUsername(account.enteredUsername, function(error, accountFromDb){
            if(error){
                console.log("ERROR MESSAGE: ", error)
                response.render("login.hbs")
            }else{
                bcrypt.compare(account.enteredPassword, accountFromDb.password, function(err, res) {
                    if(res){
                        request.session.isLoggedIn = true
                    request.session.user = accountFromDb.username
                    request.session.userEmailadress = accountFromDb.email
                    request.session.userId = accountFromDb.id
                    response.redirect("/account/overview")
                    }else{
                        response.render("login.hbs")
                    }
                });
            }
        })
    }
   
})

router.post("/signup", function(request, response){
	
	const account = {
        username: request.body.username,
        email: request.body.email,
        password: request.body.password,
        confirmationPassword: request.body.confirmationPassword
    }  
	
    
	const errors = getValidationErrors(account)
	
	if(errors.length == 0){

        bcrypt.hash(account.password, saltRounds, function(err, hash) {
            account.password = hash

            db.createAccount(account, function(error, accountID){
                if(error){
                    const model = {
                        error: error
                    }
                    console.log("error router:" , error)
                    response.render("signup.hbs", model)
                }else{
                    console.log("createAccount:", accountID)
                    response.render("login.hbs")
    
                }
            })
        });
		
		
		
	}else{
		
		const model = {
			errors: errors
		}
        console.log("error:" , errors)
		
		response.render("signup.hbs", model)
		
	}
	
})

router.get("/logout", function(request, response){
    console.log("Destroying session")
    request.session.destroy(function(error){
        console.log(error)
    })
    response.redirect("/")
})

router.get("/accounts", function(request, response){

	db.getAllAccounts(function(error, accounts){
		
		if(error){
			console.log("ERROR" , error);
			
			const model = {
				errorOcurred: true
			}
			response.render("accounts.hbs", model)
			
		}else{
			
			const model = {
				accounts: accounts
			}
			console.log(model);
			response.render("accounts.hbs", model)
			
		}
		
	})
})

router.get("/explore", function(request, response){

    db.getAllPlaylists(function(error, playlists){
		
		if(error){
			console.log("ERROR" , error);
			
			const model = {
				errorOcurred: true
			}
			response.render("playlists.hbs", model)
			
		}else{
			response.render("explore.hbs", {playlists})
			
		}
		
	})
})

module.exports = router

function getValidationErrors(account){
	
	const errors = []
	
	if(account.username.length == 0){
		errors.push("Username may not be empty.")
	}
	
	if(account.email.length == 0){
		errors.push("Email may not be empty.")
	}
    if(account.password.length == 0){
        errors.push("Password may not be empty.")
    }
    if(account.password != account.confirmationPassword){
        errors.push("Passwords doesn't match")
    }
	
	return errors
	
}