const csv = require('csv-parser')
const fs = require('fs')
const rdf = require('rdflib')

//Creating the graph where the tripples will be stored.
var store = rdf.graph()

var results = []

//Prefixes.
var RDF = rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
var RDFS = rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#")
var FOAF = rdf.Namespace("http://xmlns.com/foaf/0.1/")
var GEO = rdf.Namespace("http://www.w3.org/2003/01/geo/wgs84_pos#")
var DBO = rdf.Namespace("https://dbpedia.org/ontology/")
var DBR = rdf.Namespace("http://dbpedia.org/resource/")
var DBP = rdf.Namespace("https://dbpedia.org/property/")
var SCHEMA = rdf.Namespace("https://schema.org/")
var XSD = rdf.Namespace("http://www.w3.org/2001/XMLSchema#")
var MO = rdf.Namespace("http://purl.org/ontology/mo/")
var m3lite = rdf.Namespace("http://purl.org/iot/vocab/m3-lite#")



//Parse csv file.
fs.createReadStream("rdfTrippleStore/top50.csv")
  .pipe(csv())
  .on('data', (data) => {
    results.push(data)
    store.add(DBR(replaceSpaceWith_(data.TrackName)), RDF('type'), DBO('Song'))
    store.add(DBR(replaceSpaceWith_(data.TrackName)), FOAF('name'), data.TrackName)
    store.add(DBR(replaceSpaceWith_(data.ArtistName)), RDF('type'), FOAF('person'))
    store.add(DBR(replaceSpaceWith_(data.TrackName)), DBO('genre'), data.Genre)
    store.add(DBR(replaceSpaceWith_(data.TrackName)), m3lite('BeatPerMinute'), data.BeatsPerMinute)
    store.add(DBR(replaceSpaceWith_(data.TrackName)), MO('MusicArtist'), data.ArtistName)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), energy)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Danceability)
    store.add(DBR(replaceSpaceWith_(data.TrackName)), m3lite('Decibel'), data.Loudness)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Liveness)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Valence)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Length)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Acousticness)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Speechiness)
    //store.add(DBR(replaceSpaceWith_(data.Track_Name)), Popularity)

  })
  .on('end', () => {
    fs.writeFile("songs.ttl", rdf.serialize(null, store, 'text/turtle'), function (err) {
      if(err){
          return console.log(err);
     }
  })

  });

function replaceSpaceWith_(str){
  return str.replace(/\s+/g,'_')
}
