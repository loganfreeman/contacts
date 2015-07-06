var _ = require( 'lodash' );

var expect = require( 'chai' ).expect,
    should = require( 'chai' ).should();

var mongoose = require( 'mongoose' );

var Promise = require( 'bluebird' );



require( '../../models' );


var utils = require( '../../utils.js' );


describe( 'Contact Model', function() {
    var db, Contact;


    var contact = {
        'firstname': 'julian',
        'lastname': 'regan',
        'phone': '801-678-4334'
    };



    before( function(done) {
        // add dummy data
        db = utils.connect( 'test' );
        Contact = db.model( 'Contact' );




        Promise.resolve( Contact.create( contact ) )
            .then( function(result) {
                expect( result.firstname ).to.be.eq( 'julian' );
                done();
            } )
            .catch( function(err) {
                console.log( err );
                done( err );
            } );

    } );

    after( function(done) {
        // clean up the test db
        db.db.dropDatabase( function() {
            db.close();
            done();
        } );
    } );

    it( 'should create contact', function(done) {
        Promise.resolve( Contact.findOne( {
            firstname: 'julian'
        } ).exec() ).then( function(contact) {
            expect( contact.firstname ).to.be.eq( 'julian' );
            done();
        } );
    } );





} );