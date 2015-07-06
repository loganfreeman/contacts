var fs = require( 'fs' ),
    path = require( 'path' );

var mongoose = require( 'mongoose' );

// Bootstrap models
fs.readdirSync( __dirname )
    .filter( function(file) {
        return ((file.indexOf( '.' ) !== 0) && (file !== 'index.js') && (file.slice( -3 ) == '.js'));
    } )
    .forEach( function(file) {
        require( __dirname + '/' + file );
    } );