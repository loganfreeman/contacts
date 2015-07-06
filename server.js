//server.js

var express = require( 'express' );
var app = express();
var mongoose = require( 'mongoose' );
var Promise = require( 'bluebird' );

require( './models' );

var utils = require( './utils.js' );



var db = utils.connect();

var Contact = db.model( 'Contact' );

app.configure( function() {
    app.use( express.static( __dirname + '/public' ) ); // Localización de los ficheros estáticos
    app.use( express.logger( 'dev' ) ); // Muestra un log de todos los request en la consola
    app.use( express.bodyParser() ); // Permite cambiar el HTML con el método POST
    app.use( express.methodOverride() ); // Simula DELETE y PUT
} );

// Rutas de nuestro API
app.get( '/api/contacts', function(req, res) { // GET de todos los TODOs
    Promise.resolve( Contact.find().exec() ).then( function(contacts) {
        res.json( contacts );
    } ).catch( function(err) {
        res.status( 500 ).send( err );
    } );
} );

app.post( '/api/contacts', function(req, res) {
    console.log( req.body );
    Promise.resolve( Contact.create( req.body ) ).then( function(contact) {
        res.json( contact );
    } )
        .catch( function(err) {
            res.status( 500 ).send( err );
        } );
} );



// Escucha y corre el server
app.listen( 8080, function() {
    console.log( 'App listening on port 8080' );
} );

