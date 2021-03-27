const express = require('express')
const db = require('../data-access/account-repository')
const songs = require('../songs')
var bcrypt = require('bcryptjs');
const saltRounds = 10;

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})


router.get("/signup", function(request, response){
    response.render("signup.hbs")
})

router.get("/settings", function(request, response){
    if(!request.session.userId) return response.render("home.hbs")
    const account = {
        username: request.session.username,
        email: request.session.email
    }
    response.render("settings.hbs", {account})
})

router.post("/updateEmail", function(request, response){
    const newEmail = request.body.email
    console.log(newEmail);

    db.updateEmail(newEmail, request.session.userId, function(error){
        if(error){
            response.render("settings.hbs", {errors: error})
        }else response.render("overview.hbs")
    })
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
                response.render("login.hbs", {error: "Wrong username"})
            }else{
                bcrypt.compare(account.enteredPassword, accountFromDb.password, function(err, res) {
                    if(res){
                        request.session.isLoggedIn = true
                        request.session.user = accountFromDb.username
                        request.session.userEmailadress = accountFromDb.email
                        request.session.userId = accountFromDb.id
                        response.redirect("/playlist/overview")
                    }else{
                        console.log("wrong password");
                        response.render("login.hbs", {error: "Wrong password"})
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

            db.createAccount(account, function(errors, accountID){
                if(errors){
                    console.log("error router:" , errors)
                    response.render("signup.hbs", {errors})
                }else{
                    //console.log("createAccount:", accountID)
                    response.render("login.hbs")
    
                }
            })
        });
		
		
		
	}else{
        console.log("error:" , errors)
		response.render("signup.hbs", {errors})
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
			//console.log(model);
			response.render("accounts.hbs", model)
			
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

