const sqlite3 = require('sqlite3')


const db = new sqlite3.Database("my-database-db")

db.run(" CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL UNIQUE, \
    email VARCHAR(50) NOT NULL UNIQUE, \
    password VARCHAR(30) NOT NULL) \
    ")


exports.getAllAccounts = function(callback){
    const query = "SELECT * FROM accounts ORDER BY username"
    //callback function to run code block after query is executed.
    db.all(query, function(error, accounts){
        callback(error, accounts)
    })
}

exports.createAccount = function(account, callback){

    console.log(account.username, account.email, account.password)
	
	const query = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)"
	const values = [account.username, account.email, account.password]
	
	db.run(query, values, function(error){
		
		if(error){
            console.log("error fromdb:", error);
            
            if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.username"){
                console.log("Username already in use")
                callback(["Username already in use"], null)
            }
            else if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.email"){
                console.log("Email already in use")
                callback(["Email already in use"], null)
            }
		}else{
			callback(null, this.lastID)
		}
		
	})
}

exports.getAccountByUsername = function(username, callback){
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [username]

    db.get(query, values, function(error, account){
		
		if(error){
			callback("Database error.")
		}else{
			callback(null, account)
		}
		
	})
}