const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("my-database-db")

//stores all playlists
db.run(" CREATE TABLE IF NOT EXISTS playlists (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    username VARCHAR(50) NOT NULL, \
    accountId INTEGER NOT NULL, \
    playlistname VARCHAR(30) NOT NULL, \
    isPublic INTEGER NOT NULL, \
    FOREIGN KEY(accountId) REFERENCES accounts(id), \
    FOREIGN KEY(username) REFERENCES accounts(username)) \
    ")

exports.getAllPlaylists = function(callback){
    const query = "SELECT * FROM playlists ORDER BY id"
    //callback function to run code block after query is executed.
    db.all(query, function(error, playlists){
        if(error)callback(error, null)
        else callback(null, playlists)
    })
}

exports.getPlaylistByUserId = function(userId, callback){
    const query = "SELECT * FROM playlists WHERE accountId = ?"
    const values = [userId]

    db.all(query, values, function(error, playlistsFromDb){
        if(error){
            console.log("ERROR GETTING PLAYLITS: ", error);
            callback(error, null)
        }
        else{
            //console.log("Retrieved playlists from DB: ", playlistsFromDb);
            callback(null, playlistsFromDb)
        }
    })
}

exports.createPlaylist = function(model, callback){

    const query = "INSERT INTO playlists (username, accountId, playlistname, isPublic) VALUES (?, ?, ?, ?)"
	const values = [model.username, model.userId, model.playlistname, model.isPublic]

    db.run(query, values, function(error){
		
		if(error){
            console.log("error playlistsDB:", error);
            callback(error, null)
		}else{
			callback(null, this.lastID)
		}
		
	})
}

exports.updatePlaylist = function(playlistname, id,isPublic, callback){
    const query = 'UPDATE playlists SET playlistname = ?, isPublic = ? WHERE id = ?'
    const values = [playlistname, isPublic, id]
    
    db.run(query, values, function(error, results){
        if(error){
            console.log("Error updating playlist: ", error)
            callback(error, null)
        }
        else{
            //inserId?------------------------------------------------------------------------------
            //console.log("updated playlist with id :", results.insertId)
            callback(null, results)
        }

    })
}

exports.deletePlaylist = function(playlistId, callback){
    const query = "DELETE FROM playlists WHERE id = ?"
    const query2 = "DELETE FROM playlists_songs where playlistId = ?"

    const values = [playlistId]

    db.run(query, values, function(error){
        if(error){
            console.log(error);
            callback(error)
        }
        else{
            db.run(query2, values, function(error){
                if(error){
                    console.log(error);
                    callback(error)
                }
                else{
                    callback(null)
                }
            })
        }
    })
}