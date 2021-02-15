const sqlite3 = require('sqlite3')


const db = new sqlite3.Database("my-database-db")

db.run(" CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username TEXT, \
    email TEXT, \
    password TEXT) \
    " )


exports.getAllAccounts = function(callback){
    const query = "SELECT * FROM accounts ORDER BY username"
    //callback function to run code block after query is executed.
    db.all(query, function(error, accounts){
        callback(error, accounts)
    })
}

exports.createAccount = function(username, email, password, callback){

    console.log(username, email, password)
	
	const query = "INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)"
	const values = [username, email, password]
	
	db.run(query, values, function(error){
		
		if(error){
			callback("Database error:", error)
		}else{
			callback(null, this.lastID)
		}
		
	})
	
}