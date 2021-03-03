const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const db = require("./db")
const cookieParser = require('cookie-parser')
const session = require('express-session')



const app = express()

app.engine("hbs", expressHandlebars({
	defaultLayout: "main.hbs"
}))

app.use(
	express.static("public")
)
app.use((cookieParser()))
app.use(session({
	resave: false,
    saveUninitialized: false,
	secret: 'woldufnegh'
}))

app.use(function(request, response, next){
	const isLoggedIn = request.session.isLoggedIn
	const activeUsername = request.session.user
	const activeUserEmailadress = request.session.email
	const activeUserId = request.session.userId

	response.locals.isLoggedIn = isLoggedIn
	response.locals.activeUsername = activeUsername
	response.locals.activeUserEmailadress = activeUserEmailadress
	response.locals.activeUserId = activeUserId
	next()
})


app.get("/test", function(request, response){

	let counter = 123366

	if(request.cookie.counter){
		counter = parseInt(request.cookies.counter) + 1036
	}

	response.cookie("counter", counter)
})

app.use(bodyParser.urlencoded({
	extended: false
}))



app.get("/", function(request, response){
	response.render("home.hbs")
})





//Attaching routers
const accountRouter = require('./router/account-router')
const contactRouter = require('./router/contacts-router')
const aboutRouter = require('./router/about-router')
const playlistRouter = require('./router/playlist-router')

app.use("/account", accountRouter)
app.use("/contacts", contactRouter)
app.use("/about", aboutRouter)
app.use("/playlist", playlistRouter)

app.listen(8080)