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
        receiver.connect('tcp://127.0.0.1:' + constants.PORT_PUBLISHER_FOR_CLIENTS);
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


describe('Channel Assign', function() {
    it('It must assign channels', function (done) {
        var messagePublisher = require('../worker/messagePublisher')();
        var messageReceiver = require('../worker/messageReceiver')({"meesagePublisher": messagePublisher, "atahualpas": [{"ip": "127.0.0.1"}]});
        var channelAssign = require('../worker/channelAssign')({"messageReceiver": messageReceiver});

         
        var chaskiAssigner = zmq.socket('req');
        chaskiAssigner.connect('tcp://127.0.0.1:' + constants.PORT_CHASKI_ASSIGNER);
        var channel = 'fakeChannel';
        chaskiAssigner.send(channel);
        chaskiAssigner.on('message', function(result, data){
            assert.equal(result, 200);
            messagePublisher.close();
            messageReceiver.close();
            channelAssign.close();
            chaskiAssigner.close();
            done();
        });
    });
});


describe('Message Receiver', function() {
    it('It must receive messages', function (done) {
        var messagePublisher = require('../worker/messagePublisher')();
        var messageReceiver = require('../worker/messageReceiver')({"meesagePublisher": messagePublisher, "atahualpas": [{"ip": "127.0.0.1"}]});
        var channelAssign = require('../worker/channelAssign')({"messageReceiver": messageReceiver});

         
        var chaskiAssigner = zmq.socket('req');
        chaskiAssigner.connect('tcp://127.0.0.1:' + constants.PORT_CHASKI_ASSIGNER);
        var channel = 'fakeChannel';
        var dataToPublish = 'holavato';
        chaskiAssigner.send(channel);
        chaskiAssigner.on('message', function(result, data){ });

        var atahualpaMock = zmq.socket('pub');
        atahualpaMock.bind('tcp://*:' + constants.PORT_CHASKIES);
        
        var receiver = zmq.socket('sub');
        receiver.connect('tcp://127.0.0.1:' + constants.PORT_PUBLISHER_FOR_CLIENTS);
        receiver.subscribe(channel);

        var sendFakeData = function (){atahualpaMock.send([channel, dataToPublish]);};
        setInterval(sendFakeData, 100);

        receiver.on('message', function(topic, data) {
            assert.equal(channel, topic);
            assert.equal(data, dataToPublish);
            messagePublisher.close();
            messageReceiver.close();
            channelAssign.close();
            atahualpaMock.close();
            receiver.close();
            done();
        });
        
    });
});

