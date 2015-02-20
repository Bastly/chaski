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
    var messagePublisher = opts.messagePublisher;
    for(var i=0; i < atahualpas.length; i++){
        var messageReceiverSub = zmq.socket('sub'); 
        messageReceiverSub.connect('tcp://' + atahualpas[i].ip+ ':' + constants.PORT_CHASKIES);
        messageReceiverSub.on('message', function(topic, data){
            messagePublisher.send([topic, data]);
        }); 
        receiversSubs.push(messageReceiverSub);
    } 
   
    
    var module = {};

    module.addChannel = function addChannel(channelId){
        for(var i = 0; i < receiversSubs.length; i++){
            receiversSubs[i].subscribe(channelId);
        }
    };
    
    module.close = function close(){
        for(var i = 0; i < receiversSubs.length; i++){
            receiversSubs[i].close();
        }
    };

    return module;
};
