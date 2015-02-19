module.exports = function(){
    
    var zmq = require('zmq');
    var constants = require('constants');
    var messagePublisherPub = zmq.socket('pub'); // publishing channel to forward messages that should be handled by workers.
    
    messagePublisherPub.bind('tcp://*:' + constants.PORT_CHASKIES);
    var module = {};
    
    module.send = function send(params){
        messagePublisherPub.send(params);

    };
    
    return module;
};
