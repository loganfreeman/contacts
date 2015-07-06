'use strict';

var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;


var uniqueValidator = require( 'mongoose-unique-validator' );

var ContactSchema = new Schema( {
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    phone: {
        type: String
    }
} );


/**
 * Define model.
 */

ContactSchema.plugin( uniqueValidator );

mongoose.model( 'Contact', ContactSchema );