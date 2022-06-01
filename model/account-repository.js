const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("SQLiteDB")

//stores all accounts
db.run(" CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL UNIQUE, \
    email VARCHAR(50) NOT NULL UNIQUE, \
    password VARCHAR(50) NOT NULL) \
    ")

exports.getAllAccounts = function(callback){
    const query = "SELECT * FROM accounts ORDER BY username"
    //callback function to run code block after query is executed.
    db.all(query, function(error, accounts){
        if(error)callback("Database error.", null)
        else callback(null, accounts)
    })
}

exports.getAccountByUsername = function(enteredUsername, callback){
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [enteredUsername]

    db.get(query, values, function(error, accountFromDb){
		if(error)callback("Database error.", null)
        else if(accountFromDb)callback(null, accountFromDb)
        else callback("No account with that username", null)
	})
}

exports.createAccount = function(account, callback){

    console.log(account.username, account.email, account.password)
	
	const query = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)"
	const values = [account.username, account.email, account.password]
	
	db.run(query, values, function(error){
		if(error){
            if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.username") callback(["Username already in use"], null)
            if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: accounts.email") callback(["Email already in use"], null)     
		}else callback(null, this.lastID)
	})
}

exports.updateEmail = function(email, id, callback){
    const query = 'UPDATE accounts SET email = ? WHERE id = ?'
    const values = [email, id]

    db.run(query, values, function(error, results){
        if(error){
            if(error.code == 'SQLITE_CONSTRAINT') callback(["Email already in use"], null)
            else callback("Database error.", null)
        }else callback(null, results)
    })
}
