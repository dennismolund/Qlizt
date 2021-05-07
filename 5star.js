//ändra namn i Queryn.

const SparqlClient = require('sparql-http-client')

const endpointUrl = 'http://dbtune.org/jamendo/sparql/'

var query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
    PREFIX ns1: <http://purl.org/ontology/mo/>
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    SELECT * WHERE {
        ?x rdf:type ns1:MusicArtist .
        ?x foaf:name ?name .
        ?x foaf:made ?made .
        ?made ns1:track ?track .
        ?track dc:title ?songName .
    }
    LIMIT 10`


const client = new SparqlClient({ endpointUrl })


async function init(){
    const stream = await client.query.select(query)

    stream.on('data', row => {
        Object.entries(row).forEach(([key, value]) => {
        console.log(`${key}: ${value.value} (${value.termType})`)
        })
    })
    
    stream.on('error', err => {
        console.error(err)
    })
    
}

init()


