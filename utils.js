var mongoose = require( 'mongoose' );

var config = require( './config.js' );

exports.connect = function connect(database) {
    return mongoose.createConnection( 'mongodb://localhost/' + database || config.mongo.database );
};