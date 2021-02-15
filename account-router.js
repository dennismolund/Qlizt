const express = require('express')
const db = require('./db')

const router = express.Router()

router.get("/login", function(request, response){
    response.render("login.hbs")
})

router.get("/signup", function(request, response){
    response.render("signup.hbs")
})

router.post("/signup", function(request, response){
	
	const username = request.body.username
	const email = request.body.email
    const password = request.body.password

    
	
	const errors = getValidationErrors(username, email,password)
	
	if(errors.length == 0){
		
		db.createAccount(username, email, password, function(error, accountID){
			if(error){
				console.log("error:" , error)
			}else{
				console.log("createAccount:", accountID)
                response.render("login.hbs")

			}
		})
		
	}else{
		
		const model = {
			errors: errors,
			username: username,
			email: email,
            password: password
		}
        console.log("error:" , model.errors)
		
		response.render("signup.hbs", model)
		
	}
	
})

function getValidationErrors(username, email, password){
	
	const errors = []
	
	if(username.length == 0){
		errors.push("Name may not be empty.")
	}
	
	if(email.length == 0){
		errors.push("Email may not be empty.")
	}
    if(password.length == 0){
        errors.push("Password may not be empty.")
    }
	
	return errors
	
}

module.exports = router


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