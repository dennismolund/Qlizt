const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(function(request, response, next){
     console.log("In Rest API INDEX:",request.method, request.url);
     next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

const accountRouter = require('./router/account')
const playlistRouter = require('./router/playlist')
const songsRouter = require('./router/song');

app.use("/api/account", accountRouter)
app.use("/api/playlist", playlistRouter)
app.use("/api/song", songsRouter)
//8080
app.listen(3000)

