var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');
var zmq = require('zmq');
var constants = require('bastly_constants');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});

describe('Must receive pings', function() {
    it('It must receive pings', function (done) {

        var clientPings = require('../worker/clientPings')();

        var pong = zmq.socket('sub');
        pong.connect('tcp://127.0.0.1:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_PINGS);
        pong.subscribe('ping');
        pong.on('message', function(topic, data) {
            assert.equal(data, 'ping');
            clientPings.close();
            pong.close();
            done();
        });
    });
});

describe('Message Publisher', function() {
    it('It must publish messages', function (done) {

        var messagePublisher = require('../worker/messagePublisher')();

        var receiver = zmq.socket('sub');
        receiver.connect('tcp://127.0.0.1:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_MESSAGES);
        receiver.subscribe('fakeChannel');
        var channel = 'fakeChannel';
        var dataToPublish = 'fakeData';

        messagePublisher.send([channel, dataToPublish]);
        receiver.on('message', function(topic, data) {
            assert.equal(channel, topic);
            assert.equal(data, dataToPublish);
            messagePublisher.close();
            receiver.close();
            done();
        });
    });
});

