const express = require('express')
const db = require('../db')

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})

router.get("/overview", function(request, response){
    response.render("overview.hbs")
})

router.get("/signup", function(request, response){
    response.render("signup.hbs")
})

router.post("/loginRequest", function(request, response){
    const account = {
        username: request.body.username,
        password: request.body.password,
    }

    if(account.username.length == 0 || account.password.length == 0){
        response.render("login.hbs")
    }else{
        db.getAccountByUsername(account.username, function(error, accountFromDb){
            if(error){
                console.log("ERROR MESSAGE: ", error)
                response.render("login.hbs")
            }else{
                console.log("AccountFromDB in router:" + accountFromDb)
                if(account.password == accountFromDb.password){
                    console.log("SUCCESSFULL LOGIN!");
                    request.session.user = accountFromDb.username
    
                    
                    response.redirect("/account/overview")
                }
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
		
	}else{
		
		const model = {
			errors: errors
		}
        console.log("error:" , errors)
		
		response.render("signup.hbs", model)
		
	}
	
})

router.get("/sign-out", function(request, response){
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