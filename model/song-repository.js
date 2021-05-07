const sqlite3 = require('sqlite3')
const db = new sqlite3.Database("SQLiteDB")

//stores songs within playlists with playlistId as foreign key.
db.run(" CREATE TABLE IF NOT EXISTS songs (\
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    playlistId INTEGER NOT NULL, \
    artist VARCHAR(50) NOT NULL, \
    title VARCHAR(50) NOT NULL,\
    FOREIGN KEY(playlistId) REFERENCES playlists(id)) \
    ")

exports.addSongToPlaylist = function(playlistId, title, artist, callback){
    const query = "INSERT INTO songs (playlistId, title, artist) VALUES (?,?,?)"
    const values = [playlistId, title, artist]
    
    db.run(query, values, function(error){
        if(error) callback("Database error.") 
        else callback(null)
    })
}
    
exports.getSongsByPlaylistId = function(playlistId, callback){
    const query = "SELECT * FROM songs WHERE playlistId = ?"
    const value = [playlistId]

    db.all(query, value, function(error, songs){
        if(error) callback("Database error.", null)
        else callback(null,songs) 
    })
}

exports.deleteSongFromPlaylist = function(songId, callback){
    const query = "DELETE FROM songs WHERE id = ?"
    const value = [songId]

    db.run(query, value, function(error){
        if(error) callback("Database error.")
        else callback(null) 
    })
}