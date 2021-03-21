const jwt = require("jsonwebtoken");
const SECRET = "I Am Batman"

exports.authenticateToken = function (request, response, next) {
    const authHeader = request.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.sendStatus(401) //check if token has been sent

    jwt.verify(token, SECRET, function(error, account){
        if(error) return response.sendStatus(403) //Unauthorized token
        request.account = account
        next()
    })
}