// DEPENDENCIES
var bunyan = require('bunyan');
var domain = require('domain').create();
var constants = require('bastly_constants');
var log = bunyan.createLogger
({
    name: "chaski-zeromq",
    streams: [
        {
            path: '/var/log/chaski-zeromq.log'
        }
    ]
});



//giving bunyan a chance to flush
domain.on('error', function(err){
    // log the exception
    log.fatal(err);

    if (typeof(log.streams[0]) !== 'object') return;

    // throw the original exception once stream is closed
    log.streams[0].stream.on('close', function(streamErr, stream) {
        process.exit(1);
    });

    // close stream, flush buffer to disk
    log.streams[0].stream.end();
});

domain.run(function(){

    if(!process.argv[2]){
        log.info('Must give atahualpa ip');
        throw new Error('insuficientarametersgiven');
    }
    log.info('Launching');

    var IP_ATAHUALPA = process.argv[2];
    var chaski_connector = require('../chaski-connector')({ipAtahualpa:IP_ATAHUALPA, log:log});


    var clientPings = require('./worker/clientPings')({log:log});
    var messagePublisher = require('./worker/messagePublisher')({log:log});
    log.info('message publisher is');
    messagePublisher.send('hola');
    log.info(messagePublisher);
    
    var busData = chaski_connector.busData({"messagePublisher": messagePublisher , "atahualpas": [{"ip": IP_ATAHUALPA}]});
    var busOps = chaski_connector.busOps({busData: busData, log:log, chaskiId:constants.CHASKI_TYPE_ZEROMQ});
});
