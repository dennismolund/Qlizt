const { EnapsoGraphDBClient } = require('@innotrade/enapso-graphdb-client');
const GRAPHDB_BASE_URL = 'http://localhost:7200/',
    GRAPHDB_REPOSITORY = 'QliztRepo',
    GRAPHDB_USERNAME = 'admin',
    GRAPHDB_PASSWORD = '123123',
    GRAPHDB = 'http://www.openrdf.org/schema/sesame#nil';

const DEFAULT_PREFIXES = [
    EnapsoGraphDBClient.PREFIX_OWL,
    EnapsoGraphDBClient.PREFIX_RDF,
    EnapsoGraphDBClient.PREFIX_RDFS,
    EnapsoGraphDBClient.PREFIX_XSD,
    EnapsoGraphDBClient.PREFIX_PROTONS,
    {
        prefix: 'entest',
        iri: 'http://ont.enapso.com/test#'
    }, 
    {
        prefix: 'foaf',
        iri: 'http://xmlns.com/foaf/0.1/'
    },
    {
        prefix: 'dbo',
        iri: 'https://dbpedia.org/ontology/'
    },
    {
        prefix: 'mo',
        iri: 'http://purl.org/ontology/mo/'
    },
    {
        prefix: 'ont',
        iri: 'https://dbpedia.org/ontology/'
    }

];

let graphDBEndpoint = new EnapsoGraphDBClient.Endpoint({
    baseURL: GRAPHDB_BASE_URL,
    repository: GRAPHDB_REPOSITORY,
    prefixes: DEFAULT_PREFIXES,
    transform: 'toJSON'
});

graphDBEndpoint.login(GRAPHDB_USERNAME, GRAPHDB_PASSWORD)
.then((result) => {
    songs = result
})
.catch((err) => {
    console.log(err);
});


exports.getAllSongs = function(request, response, next){

    
    graphDBEndpoint.query(
        `select ?title ?artist from <${GRAPHDB}>
                where {
                    ?x foaf:name ?title .
                    ?x mo:MusicArtist ?artist .
                    
                }`
        )
        .then((result) => {
            request.session.songs = result.records
            next()
            
        })
        .catch((err) => {
            console.log("*failed to retrieve songs*: ",err);
            next()
        });
}

exports.getPopSongs = function(callback){

    
    graphDBEndpoint.query(
        `
            select ?title ?artist from <${GRAPHDB}>
                where { 
                    VALUES ?value
                        {
                        "pop"
                        "dance pop"
                        "australian pop"
                        "pop house"  
                        "panamanian pop"
                        "electropop"
                        "boy band"
                        "latin"
                        "r&b en espanol"
                        }
                    ?x foaf:name ?title .
                    ?x mo:MusicArtist ?artist .
                    ?x ont:genre ?value . 
                }
        `
        )
        .then((result) => {
            callback(result.records)
            
        })
        .catch((err) => {
            console.log("*failed to retrieve songs*: ",err);
            callback(null)
        });
}

exports.getEdmSongs = function(callback){

    
    graphDBEndpoint.query(
        `
        select ?title ?artist from <${GRAPHDB}>
            where { 
                VALUES ?value
                    {
                    "edm"
                    "brostep"
                    "pop house"
                    }
                ?x foaf:name ?title .
                ?x mo:MusicArtist ?artist .
                ?x ont:genre ?value . 
            }
        `
        )
        .then((result) => {
            callback(result.records)
            
        })
        .catch((err) => {
            console.log("*failed to retrieve songs*: ",err);
            callback(null)
        });
}

exports.getReggaetonSongs = function(callback){

    
    graphDBEndpoint.query(
        `
        select ?title ?artist from <${GRAPHDB}>
            where { 
                VALUES ?value
                    {
                        "reggaeton flow"
                        "reggaeton"
                        "r&b en espanol"

                    }
                ?x foaf:name ?title .
                ?x mo:MusicArtist ?artist .
                ?x ont:genre ?value . 
            }
        `
        )
        .then((result) => {
            callback(result.records)
            
        })
        .catch((err) => {
            console.log("*failed to retrieve songs*: ",err);
            callback(null)
        });
}

exports.getHipHopSongs = function(callback){

    
    graphDBEndpoint.query(
        `
        select ?title ?artist from <${GRAPHDB}>
            where { 
                VALUES ?value
                    {
                        "atl hip hop"
                        "dfw rap" 
                        "r&b en espanol"
                        "country rap"
                        "trap music"
                        "escape room"
                        

                    }
                ?x foaf:name ?title .
                ?x mo:MusicArtist ?artist .
                ?x ont:genre ?value . 
            }
        `
        )
        .then((result) => {
            callback(result.records)
            
        })
        .catch((err) => {
            console.log("*failed to retrieve songs*: ",err);
            callback(null)
        });
}