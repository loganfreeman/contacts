'use strict';

var mongoose = require( 'mongoose' ),
    Schema = mongoose.Schema;

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

mongoose.model( 'Contact', ContactSchema );