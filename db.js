const sqlite3 = require('sqlite3')


const db = new sqlite3.Database("my-database-db")

//stores all accounts
db.run(" CREATE TABLE IF NOT EXISTS accounts (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL UNIQUE, \
    email VARCHAR(50) NOT NULL UNIQUE, \
    password VARCHAR(30) NOT NULL) \
    ")

//stores all playlists
db.run(" CREATE TABLE IF NOT EXISTS playlists (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL, \
    userId INTEGER NOT NULL, \
    email VARCHAR(50) NOT NULL, \
    playlistname VARCHAR(30) NOT NULL) \
    ")

db.run(" CREATE TABLE IF NOT EXISTS songs (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    title VARCHAR(50) NOT NULL, \
    artist VARCHAR(50) NOT NULL)\
    ")

//stores songs within playlists with playlistId as foreign key.
db.run(" CREATE TABLE IF NOT EXISTS playlists_songs (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    playlistId INTEGER NOT NULL, \
    song_id INTEGER NOT NULL )\
    ")

exports.getAllAccounts = function(callback){
    const query = "SELECT * FROM accounts ORDER BY username"
    //callback function to run code block after query is executed.
    db.all(query, function(error, accounts){
        callback(error, accounts)
    })
}

exports.getAllPlaylists = function(callback){
    const query = "SELECT * FROM playlists ORDER BY id"
    //callback function to run code block after query is executed.
    db.all(query, function(error, playlists){
        callback(error, playlists)
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

exports.getAccountByUsername = function(enteredUsername, callback){
    const query = "SELECT * FROM accounts WHERE username = ?"
    const values = [enteredUsername]

    db.get(query, values, function(error, accountFromDb){
		
		if(error){
			callback("Database error.", null)
		}else{
			callback(null, accountFromDb)
		}
		
	})
}

exports.createPlaylist = function(model, callback){

    const query = "INSERT INTO playlists (username, userId, email, playlistname) VALUES (?, ?, ?, ?)"
	const values = [model.username, model.userId, model.email, model. playlistname]

    db.run(query, values, function(error){
		
		if(error){
            console.log("error playlistsDB:", error);
            callback(error, null)
		}else{
			callback(null, this.lastID)
		}
		
	})
}

exports.getPlaylistByUserId = function(userId, callback){
    const query = "SELECT * FROM playlists WHERE userId = ?"
    const values = [userId]

    db.all(query, values, function(error, playlistsFromDb){
        if(error){
            console.log("ERROR GETTING PLAYLITS: ", error);
            callback(error, null)
        }
        else{
            console.log("Retrieved playlists from DB: ", playlistsFromDb);
            callback(null, playlistsFromDb)
        }
    })
}

exports.updatePlaylist = function(playlist, id, callback){
    console.log("article in update article: ", playlist)
    const query = 'UPDATE playlists SET playlistname = ? WHERE id = ?'
    const values = [playlist.playlistname, id]
    
    db.run(query, values, function(error, results){
        if(error){
            console.log("Error updating playlist: ", error)
            callback(['ERR_DATABASE'], null)
        }
        else{
            //inserId?------------------------------------------------------------------------------
            console.log("updated playlist with id :", results.insertId)
            callback([], results.insertId)
        }

    })
}

exports.deletePlaylist = function(playlistId, callback){
    const query = `DELETE FROM playlists WHERE id = ?`
    const values = [playlistId]
    console.log(values);

    db.run(query, values, function(error){
        if(error){
            console.log(error);
            callback(['ERR_DATABASE'])
        }
        else{
            console.log("DELETED PLAYLIST");
            callback([])
        }
    })

}

//INSERT INTO songs (title, artist) VALUES ("Landslide", "Fleetwood Mac");
//INSERT INTO songs (title, artist) VALUES ("Break My Stride", "Matthew Wilder");
//INSERT INTO songs (title, artist) VALUES ("Blood Red Roses", "Rod Stewart");
//INSERT INTO songs (title, artist) VALUES ("Yesterday", "The Beatles");
//INSERT INTO songs (title, artist) VALUES ("Steven", "Alice Cooper");
//INSERT INTO songs (title, artist) VALUES ("All the small things", "Blink-182");
//INSERT INTO songs (title, artist) VALUES ("Grenade", "Bruno Mars");
//INSERT INTO songs (title, artist) VALUES ("Purple Rain", "Prince");
//INSERT INTO songs (title, artist) VALUES ("Viva La Vida", "Coldplay");
//INSERT INTO songs (title, artist) VALUES ("Eye of the Tiger", "Fussball Hits");
//INSERT INTO songs (title, artist) VALUES ("Beat it", "Michael Jackson");
//INSERT INTO songs (title, artist) VALUES ("Gettin' Jiggy Wit It", "Will Smith");
