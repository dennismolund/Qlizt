const express = require('express')
const db = require('./db')

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})

router.post("/loginRequest", function(request, response){
    const account = {
        username: request.body.username,
        password: request.body.password,
        email: "placeholder",
        confirmationPassword: request.params.password
    }
        
        db.getAccountByUsername(account.username, function(error, accountFromDB){
            if(error){
                console.log("ERROR MESSAGE: ", error)
                response.render("login.hbs")
            }else{
                console.log("AccountFromDB in router:" + accountFromDB)
                if(account.password == accountFromDB.password){
                    console.log("SUCCESSFULL LOGIN!");
                }
            }
        })
   
})


router.get("/signup", function(request, response){
    response.render("signup.hbs")
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

/*
router.get("/login", function(request, response){


        response.render("login.hbs")
    })
    
    router.get("/signup", function(request, response){
    
        response.render("signup.hbs")
    })
    
    router.post("/singup", function(request, response){
    
        const query = "INSERT INTO accounts(name, password) VALUE(?, ?)"
        const values = [request.body.name, request.body.password]
    
        db.run(query, values, function(error){
            if(error){
    
                console.log(error)
            }else{
                response.redirect("/accounts/" + this.lastID)
            }
            
        })
    
    
        const account = {
            name,
            password,
            id: account.length + 1
        }
    
        account.push(account)
    
        response.redirect("/accounts/" + id)
    })
    
    router.get("/accounts", function(request, response){
    
        db.getAllAccounts(function(error, accounts){
            if(error){
                console.log(error)
                const model = {
                    dbError: true
                }
            }else{
                const model = {
                    accounts: accounts
                }
            
                response.render("accounts.hbs", model)
            }
        })
    })
    
    router.get("/account/:id", function(request, response){
    
        const query = "SELECT * FROM accounts WHERE id = ?"
        const values = [request.params.id]
    
        db.get(query, values, function(error, account){
            if(error){
    
    
                console.log(error)
            }else{
    
                const model = {
                    account: account
            
                }
    
                response.render("account.hbs", model)
            }
        })
    
    
    
        
    })
    
    router.post("/accounts/:id/delete", function(request, response){
    
        const accountIndex = account.findIndex(
            h => h.id == id
        )
    
        account.splice(accountIndex, 1)
    
        response.redirect("/")
    })
    
    router.get("/accounts/:id/update", function(request, response){
    
        const account = account.find(
            h => h.id == request.params.id
        )
    
        response.render("update-account.hbs")
    })
    
    router.post("/account/:id/update", function(request, response){
    
        const account = account.find(
            h => h.id == request.params.id
        )
    
        account.name = request.body.name;
        account.password = request.body.password;
    
        response.redirect("/account/" + account.id)
    })

*/