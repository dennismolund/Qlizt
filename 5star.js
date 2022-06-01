
exports.getSongsByArtist = function(artist, callback){

    const ParsingClient = require('sparql-http-client/ParsingClient')

    const endpointUrl = 'http://dbtune.org/musicbrainz/sparql'

    var query = 
    `
        PREFIX mo: <http://purl.org/ontology/mo/>
        PREFIX mbz: <http://purl.org/ontology/mbz#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX bio: <http://purl.org/vocab/bio/0.1/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX tags: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>
        PREFIX geo: <http://www.geonames.org/ontology#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX lingvoj: <http://www.lingvoj.org/ontology#>
        PREFIX rel: <http://purl.org/vocab/relationship/>
        PREFIX vocab: <http://dbtune.org/musicbrainz/resource/vocab/>
        PREFIX event: <http://purl.org/NET/c4dm/event.owl#>
        PREFIX map: <file:/home/moustaki/work/motools/musicbrainz/d2r-server-0.4/mbz_mapping_raw.n3#>
        PREFIX db: <http://dbtune.org/musicbrainz/resource/>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX dc: <http://purl.org/dc/elements/1.1/>

        SELECT ?trackname
        WHERE {
            ?x rdf:type mo:MusicArtist ;
            foaf:name "${artist}" ;
            rdfs:label ?name .
            
            ?z rdf:type mo:Track ;
            foaf:maker ?x ;
            dc:title ?trackname

        }
        
    `

    const client = new ParsingClient({ endpointUrl })

    var array = []


    client.query.select(query).then(bindings => {

        bindings.forEach(row =>

        Object.entries(row).forEach(([key, value]) => {

            //console.log(`${key}: ${value.value} (${value.termType})`)


            array.push({
                    artist: artist,
                    title: value.value
            })
        })

    )
    callback(array)

    })



}
