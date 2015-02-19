module.exports = function(opts){
    
    // CHECK
    if(!opts){
        if(!opts.messagePublisher){
            throw new Error('message publisher needed');
        }
        if(!opts.atahualpas){
            throw new Error('atahualpas ips needed');
        }
        throw new Error('opts needed');
    }
    var zmq = require('zmq');
    var constants = require('../constants');
    var atahualpas = opts.atahualpas;

    var receiversSubs = [];
    for(var i=0; i < atahualpas.length; i++){
        var messageReceiverSub = zmq.socket('sub'); 
        messageReceiverSub.bind('tcp://' + atahualpas[i]+ ':' + constants.PORT_MESSAGE_RECEIVER);
        messageReceiverSub.on('message', function(data){
            opts.messagePublisher.send(data);
        }); 
        receiversSubs.push(messageReceiverSub);
    } 
   
    
    var module = {};

    module.addChannel = function addChannel(channelId){
        for(var i = 0; i < receiversSubs.length; i++){
        
        }
    };

    return module;
};
