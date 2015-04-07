#!/usr/bin/env node
var io = require('socket.io-client');
var socket = io.connect('http://127.0.0.1:3000', {'forceNew': true });
socket.on('ping', function(){
    console.log('gotPing worker is alive.');
    process.exit(0);
}); 

var errorCode = 9;
setTimeout((function(){
        console.log('no ping, worker must be dead');
        process.exit(errorCode);
    
    }), 2000);

