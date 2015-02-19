var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');
var zmq = require('zmq');
var constants = require('../constants');

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
        pong.connect('tcp://127.0.0.1:' + constants.PORT_CLIENT_PINGS);
        pong.subscribe('ping');
        pong.on('message', function(topic, data) {
            console.log('got message');
            console.log(topic, data);
            assert.equal(data, 'ping');
            done();
        });
    });
});

