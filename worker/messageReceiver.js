module.exports = function(opts){
    
    // CHECK
    if(!opts || !opts.messagePublisher){
        throw new Error('message publisher needed');
    }
    var zmq = require('zmq');
    var constants = require('constants');
    var messageReceiverSub = zmq.socket('sub'); 
    
    messageReceiverSub.bind('tcp://*:' + constants.PORT_MESSAGE_RECEIVER);
   
    messageReceiverSub.on('message', function(data){
        opts.messagePublisher.send(data);
    }); 
    
    var module = {};

    module.addChannel = function addChannel(channelId){
        messageReceiverSub.subscribe(channelId);    
    };

    return module;
};
