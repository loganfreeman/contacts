var mongoose = require( 'mongoose' );

var config = require( './config.js' );

exports.connect = function connect() {
    return mongoose.createConnection( 'mongodb://localhost/' + config.mongo.database );
};