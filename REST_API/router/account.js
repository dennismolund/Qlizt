const express = require('express')
const db = require('../../data-access/account-repository')
const jwt = require("jsonwebtoken");
var bcrypt = require('bcryptjs');

const { authenticateToken } = require('../middleware/authenticateToken')
const SECRET = "I Am Batman"

const router = express.Router()

router.get("/accounts", authenticateToken, function(request, response){

    
    db.getAllAccounts(function(error, accounts){
        if(error){
            response.status(400).send({
                error: error
            })
        }else{
            response.json(accounts)
        }
    })


})

router.post("/login", function(request, response){

    const grant_type = request.body.grant_type
    const username = request.body.username
    const password = request.body.password

    if(grant_type != "password"){
        response.status(400).send({
            error: "unsupported_grant_type"
        })
    }

    db.getAccountByUsername(username, function(error, accountFromDb){
        if(error){
            console.log("ERROR MESSAGE: ", error)
            console.log(error)
                    response.status(400).send({
                        error: "invalid_grant" //wrong username
                    })
        }else{
            bcrypt.compare(password, accountFromDb.password, function(err, res) {
                if(res){
                    const idToken = {
                        sub: accountFromDb.id,
                        preferred_username: accountFromDb.username
                    }
                    const accessToken = jwt.sign(idToken, SECRET)

                    response.status(200).send({
                        accessToken: accessToken,
                        token_type: "Bearer",
                        idToken
                    });
                }else{
                    response.status(400).send({
                        error: "invalid_grant" //wrong password
                    })
                   
                }
            })
        }
    })
})



module.exports = router