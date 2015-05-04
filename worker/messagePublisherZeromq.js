module.exports = function(options){
    
    var opts = options || {}; 
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    // publishing channel to forward messages to cliet
    var messagePublisherPub = zmq.socket('pub'); 
    var logHandler = require('../logHandler');
    var log = logHandler({name:'messagePublisher', log:opts.log});
    var messagePubliserUrl =  'tcp://*:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_MESSAGES;
    log.info('message publisher bind on', messagePubliserUrl);
    messagePublisherPub.bind(messagePubliserUrl);

    var module = {info:'module message publisher'};
    
    module.send = function send(topic, data){
        log.info('sending message', topic, data);
        messagePublisherPub.send([topic, from, data]);
    };
    
    module.close = function close(){
        log.info('closing', module);
        messagePublisherPub.close();
    };
    
    log.info(module, 'loaded');
    
    return module;
};
