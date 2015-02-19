// DEPENDENCIES
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "chaski"});

if(!process.argv[2]){
    log.info('Must give atahualpa ip');
    process.exit(9);
}

var IP_ATAHUALPA = process.argv[2];

var clientPings = require('./worker/clientPings')();
var messagePublisher = require('./worker/messagePublisher')();
var messageReceiver = require('./worker/messageReceiver')({"meesagePublisher": messagePublisher, "atahualpas": [{"ip": IP_ATAHUALPA}]});
var channelAssign = require('./worker/channelAssign')({"messageReceiver": messageReceiver});

