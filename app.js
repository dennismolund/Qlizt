const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require("./db")

const accountRouter = require('./account-router')

const app = express()

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.use(
	express.static("public")
	
)

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use("/account", accountRouter)

app.get("/", function(request, response){
	response.render("home.hbs")
})

app.get("/about", function(request, response){
	response.render("about.hbs")
})

app.get("/accounts", function(request, response){

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

app.listen(8080)