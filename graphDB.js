


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
        console.log(result);
        songs = result
    })
    .catch((err) => {
        console.log(err);
    });

    export function getSongs(){
        graphDBEndpoint.query(
            `select ?title ?artist from <${GRAPHDB}>
                    where {
                        ?x foaf:name ?title .
                        ?x mo:MusicArtist ?artist .
                    }`
            )
            .then((result) => {
                console.log(result);
                return result
            })
            .catch((err) => {
                console.log(err);
                return null
            });
    }
    
    
