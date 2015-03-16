// DEPENDENCIES
var bunyan = require('bunyan');
if(!process.argv[2]){
    log.info('Must give atahualpa ip');
    process.exit(9);
}

var IP_ATAHUALPA = process.argv[2];
var chaski_connector = require('chaski-connector')({ipAtahualpa:IP_ATAHUALPA});
var log = bunyan.createLogger({name: "chaski"});


var clientPings = require('./worker/clientPings')();
var messagePublisher = require('./worker/messagePublisher')();
var messageReceiver = chaski_connector.messageReceiver({"meesagePublisher": messagePublisher, "atahualpas": [{"ip": IP_ATAHUALPA}]});
var channelAssign = chaski_connector.channelAssign({"messageReceiver": messageReceiver});

