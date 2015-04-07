#!/usr/bin/env node
var zmq = require('zmq');
var constants = require('bastly_constants');

var pong = zmq.socket('sub');
pong.connect('tcp://127.0.0.1:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_PINGS);
pong.subscribe('ping');
pong.on('message', function(topic, data) {
    console.log('got ping, zeromq chaski alive');
    process.exit(0);
});


var errorCode = 9;
setTimeout((function(){
        console.log('no ping, worker must be dead');
        process.exit(errorCode);
    
    }), 2000);
