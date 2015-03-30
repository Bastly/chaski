module.exports = function(options){
    
    var opts = options || {}; 
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var messagePublisherPub = zmq.socket('pub'); // publishing channel to forward messages that should be handled by workers.
    var logHandler = require('../logHandler');
    var log = logHandler({name:'messagePublisher', log:opts.log});
    
    messagePublisherPub.bind('tcp://*:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_MESSAGES);

    var module = {info:'a message publisher appears!' };
    
    module.send = function send(params){
        log.info('sending message');
        messagePublisherPub.send(params);
    };
    
    module.close = function close(){
        log.info('closing message publisher');
        messagePublisherPub.close();
    };
    
    log.info('message publisher loaded');
    
    return module;
};
