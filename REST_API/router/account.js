const express = require('express')
const db = require('../../db')
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

    const username = request.body.username
    const password = request.body.password

    const account = {username: username}
    
    db.getAccountByUsername(username, function(error, accountFromDb){
        if(error){
            console.log("ERROR MESSAGE: ", error)
            console.log(error)
                    response.status(400).send({
                        error: error
                    })
        }else{
            console.log("account: ", accountFromDb);
            bcrypt.compare(password, accountFromDb.password, function(err, res) {
                if(res){

                    const accessToken = jwt.sign(account, SECRET)
                    const idToken = {
                        accountId: accountFromDb.id,
                        username: accountFromDb.username
                    }

                    /*const idToken = jwt.sign({
                        id: accountFromDb.id,
                        username: accountFromDb.username,
                        email: accountFromDb.username
                    }, secret)*/

                    response.status(200).send({
                        accessToken: accessToken,
                        idToken
                    });

                }else{
                    console.log("error in bcrrypt");
                    response.status(400).send({
                        error: err
                    })
                    /*
                    const accessToken = jwt.sign({
                        accountId: accountFromDb.id
                    }, secret)
                    
                    const idToken = jwt.sign({
                        id: accountFromDb.id,
                        username: accountFromDb.username,
                        email: accountFromDb.username
                    }, secret)
                    
                    response.status(200).json({
                        accessToken: accessToken,
                        idToken: idToken
                    })*/
                }
            })
        }
    })
})



module.exports = router