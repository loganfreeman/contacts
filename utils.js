var mongoose = require( 'mongoose' );

exports.connect = function connect(database) {
    return mongoose.createConnection( 'mongodb://localhost/' + database);
};