const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const path = require('path')
const {redirectIfNotLoggedIn} = require('./authMiddleware')


const app = express()

app.engine("hbs", expressHandlebars({
	extname: 'hbs', 
	defaultLayout: "main.hbs",
	layoutsDir: path.join(__dirname, '../../views/mainLayout'),
	partialsDir  : [path.join(__dirname, '../../views/partials')]
}))

var hbs = expressHandlebars.create({});

//helper function
hbs.handlebars.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

app.use(
	express.static("public")
)

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

app.use(redirectIfNotLoggedIn)

app.use(bodyParser.json())
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
const songRouter = require('./router/song-router')


app.use("/account", accountRouter)
app.use("/contacts", contactRouter)
app.use("/about", aboutRouter)
app.use("/playlist", playlistRouter)
app.use("/song", songRouter)

app.listen(8080)