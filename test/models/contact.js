var _ = require('lodash');

var expect = require('chai').expect,
    should = require('chai').should();

var mongoose = require('mongoose');

var Promise = require('bluebird');



require('../../models');


var utils = require('../../utils.js');


describe('Contact Model', function() {
    var db, Contact, contactId;


    var contact = {
        'firstname': 'julian',
        'lastname': 'regan',
        'phone': '801-678-4334'
    };



    before(function(done) {
        // add dummy data
        db = utils.connect('test');
        Contact = db.model('Contact');



        Promise.resolve(Contact.create(contact))
            .then(function(result) {
                expect(result.firstname).to.be.eq('julian');
                contactId = result._id;
                done();
            })
            .catch(function(err) {
                console.log(err);
                done(err);
            });

    });

    after(function(done) {
        // clean up the test db
        db.db.dropDatabase(function() {
            db.close();
            done();
        });
    });

    it('should create contact', function(done) {
        Promise.resolve(Contact.findOne({
            firstname: 'julian'
        }).exec()).then(function(contact) {
            expect(contact.firstname).to.be.eq('julian');
            done();
        });
    });

    it('should update contact', function(done) {
        contact.phone = '801-585-4557';
        Promise.resolve(Contact.update({
                _id: contactId
            }, contact, {
                upsert: true
            }).exec())
            .then(function(result) {
                console.log(result);
                expect(result.ok).to.eq(1);
                return Contact.findOne({
                    firstname: 'julian'
                });
            })
            .then(function(item) {
                expect(item.phone).to.be.eq('801-585-4557');
                done();
            });
    })


    it('should remove contact', function(done) {
        Promise.resolve(Contact.findById(contactId).remove().exec())
            .then(function(result) {
                expect(result.result.ok).to.eq(1);
                return Contact.findOne({
                    firstname: 'julian'
                });
            })
            .then(function(item) {
                expect(item).to.be.eq(null);
                done();
            });
    })



});