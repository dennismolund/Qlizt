const express = require('express')
const model = require('../../../model/account-repository')
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
    response.render("settings.hbs", {account: {username: request.session.username, email: request.session.email}})
})

router.post("/updateEmail", function(request, response){
    const newEmail = request.body.email
    console.log(newEmail);

    model.updateEmail(newEmail, request.session.userId, function(error){
        if(error) response.render("settings.hbs", {errors: error})
        else response.render("overview.hbs")
    })
})

router.post("/login", function(request, response){
    const account = {
        enteredUsername: request.body.username,
        enteredPassword: request.body.password,
    }

    if(account.enteredUsername.length == 0 || account.enteredPassword.length == 0) response.render("login.hbs")
    else{
        model.getAccountByUsername(account.enteredUsername, function(error, accountFromDb){
            if(error) response.render("login.hbs", {error: "Wrong username"})
            else{
                bcrypt.compare(account.enteredPassword, accountFromDb.password, function(err, res){
                    if(res){
                        request.session.isLoggedIn = true
                        request.session.user = accountFromDb.username
                        request.session.userEmailadress = accountFromDb.email
                        request.session.userId = accountFromDb.id
                        response.redirect("/playlist/overview")
                    }else if(err) response.render("login.hbs", {error: "Something went wrong, please try again later"})
                    else response.render("login.hbs", {error: "Wrong password"})
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
            if(err) response.render("signup.hbs", {error: "Something went wrong, please try again later"})

            model.createAccount(account, function(errors, accountID){
                if(errors) response.render("signup.hbs", {errors})
                else response.render("login.hbs")
            })
        });
	}else response.render("signup.hbs", {errors})
	
})

router.get("/logout", function(request, response){
    request.session.destroy()
    response.redirect("/")
})

router.get("/accounts", function(request, response){

	model.getAllAccounts(function(error, accounts){
		if(error) response.render("accounts.hbs", {model: {errorOcurred: true}})	
		else response.render("accounts.hbs", {model: {accounts: accounts}})
	})
})

module.exports = router

function getValidationErrors(account){
	const errors = []
	if(account.username.length == 0) errors.push("Username may not be empty.")
	if(account.email.length == 0) errors.push("Email may not be empty.")
    if(account.password.length == 0) errors.push("Password may not be empty.")
    if(account.password != account.confirmationPassword) errors.push("Passwords doesn't match")
	return errors
}

