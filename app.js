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
    try {
        log.fatal(err);
    }
    catch (errWtritingErr) {
    }

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

    if(!process.argv[3]){
        log.info('Must give chaskiType');
        throw new Error('chaskiType needed');
    }
    
    if(!process.argv[4]){
        log.info('Must give a chaskiId');
        throw new Error('chaski id needed ');
    }
   
    var module = {info:"chaski-connector"};


    var IP_ATAHUALPA = process.argv[2];
    var CHASKI_TYPE = process.argv[3];
    var CHASKI_ID = process.argv[4];
    
    log.info('Launching chaski',IP_ATAHUALPA, CHASKI_TYPE, CHASKI_ID);
    var clientPings;
    var messagePublisher;
    if(CHASKI_TYPE == constants.CHASKI_TYPE_ZEROMQ){
        clientPings = require('./worker/clientPingsZeromq')({log:log});
        messagePublisher = require('./worker/messagePublisherZeromq')({log:log});
    } else if (CHASKI_TYPE == constants.CHASKI_TYPE_SOCKETIO){
        var app = require('express')();
        var http = require('http').Server(app);
        var io = require('socket.io')(http);

        io.on('connection', function(socket){
            log.info('Someone connected');
        });

        http.listen(3000, function(){
            log.info('listening on *:3000');
        });
        clientPings = require('./worker/clientPingsSocketio')({io: io, log:log});
        messagePublisher = require('./worker/messagePublisherSocketio')({io: io, log:log});
    }else{
        log.info('Chaki type not implemented', CHASKI_TYPE);
        throw new Error('Chaki type not implemented');
    }


    var busData = require('./worker/busData')({log:log, "messagePublisher": messagePublisher, "atahualpas": [{"ip": IP_ATAHUALPA}]});
    var busOps = require('./worker/busOps')({log:log, chaskiId:CHASKI_ID, busData:busData, "atahualpas": [{"ip": IP_ATAHUALPA}] });


    log.info('launched');
    
});
