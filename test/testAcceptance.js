var fs = require('fs');
var assert = require('assert');
var config = require('./config.json');
var zmq = require('zmq');
var constants = require('bastly_constants');
var bunyan = require('bunyan');
var log = bunyan.createLogger
({
    name: "chaski-test",
    streams: [
    {
        path: '/var/log/chaski-test.log'
    }
    ]
});

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1, 2, 3].indexOf(5));
            assert.equal(-1, [1, 2, 3].indexOf(0));
        });
    });
});

describe('Must receive pings', function() {
    it('It must receive zeromq pings', function (done) {

        var clientPings = require('../worker/clientPingsZeromq')({log:log});

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
    it('It must publish zeromq messages', function (done) {

        var messagePublisher = require('../worker/messagePublisherZeromq')({log:log});

        var channel = 'fakeChannel';
        var fromOwner = 'fakeUser';
        var reveiverUrl = 'tcp://127.0.0.1:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_MESSAGES;
        log.info('connecting', reveiverUrl);
        var receiver = zmq.socket('sub');
        receiver.connect(reveiverUrl);
        receiver.subscribe(channel);
        var dataToPublish = 'fakeData';

        var sendFakeData = function (){
            messagePublisher.send(channel, fromOwner, dataToPublish);
        };

        var intervaler = setInterval(sendFakeData, 300);

        receiver.on('message', function(topic, from, data) {
            log.info('received');
            assert.equal(channel, topic);
            assert.equal(data, dataToPublish);
            assert.equal(from, fromOwner);
            messagePublisher.close();
            receiver.close();
            intervaler.clearTimeout();
            done();
        });
    });
});

describe('Data bus registers and listen to channel', function() {
    it('Receives messages', function (done) {
        var messagePublisher = {};

        messagePublisher.send = function(topic, from, data) {
            assert.equal(fakeChannel, topic.toString());
            assert.equal(dataToPublish, data.toString());
            busData.close();
            atahualpaMock.close();
            done();
        };

        var busData = require('../worker/busData')({log:log, messagePublisher:messagePublisher, "atahualpas": [{"ip": "127.0.0.1"}]});
        var fakeChannel = 'fake';
        var fakeApi = 'apkfake';
        var dataToPublish = 'holavato';
        var atahualpaMock = zmq.socket('pub');
        atahualpaMock.bind('tcp://*:' + constants.PORT_PUB_SUB_ATAHUALPA_CHASKI_MESSAGES);
        
        var sendFakeData = function (){
            atahualpaMock.send([fakeChannel, fakeChannel, fakeApi, dataToPublish]);
        };

        var intervaler = setInterval(sendFakeData, 10);

        busData.addChannel(fakeChannel);
    });
});


describe('BusOps ', function() {
    it('Registers new channel to listen and receives data in that channel', function (done) {
        var messagePublisher = {};
        messagePublisher.send = function(topic, from, data) {
            assert.equal(fakeChannel, topic.toString());
            assert.equal(dataToPublish, data.toString());
            busData.close();
            atahualpaMock.close();
            done();
        };
        var busData = require('../worker/busData')({log:log, messagePublisher:messagePublisher, "atahualpas": [{"ip": "127.0.0.1"}]});
        var atahualpaMockOps = zmq.socket('pub');
        var dataToPublish = 'holavato';
        atahualpaMockOps.bind('tcp://*:' + constants.PORT_PUB_SUB_ATAHUALPA_CHASKI_OPS);
        var fakeChannel = 'fakingit';
        var fakeApi = 'apkfake';
        var fakeChaskiID = 'AAA';
        var sendFakeOps = function (){
            atahualpaMockOps.send([fakeChaskiID, fakeChannel]);
        };
        var atahualpaMock = zmq.socket('pub');
        atahualpaMock.bind('tcp://*:' + constants.PORT_PUB_SUB_ATAHUALPA_CHASKI_MESSAGES);
        var sendFakeData = function (){
            atahualpaMock.send([fakeChannel, fakeChannel, fakeApi, dataToPublish]);
        };
        setInterval(sendFakeOps, 100);
        var busOps = require('../worker/busOps')({log:log, typeChaski:constants.CHASKI_TYPE_ZEROMQ, chaskiId:fakeChaskiID, busData:busData, "atahualpas": [{"ip": "127.0.0.1"}] });
        setInterval(sendFakeData, 100);

        
    });
});


//TODO missing tests for socketio
