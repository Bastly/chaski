module.exports = function(opts){
    
    // CHECK
    if(!opts || !opts.messageReceiver){
        throw new Error('message publisher needed');
    }
    var zmq = require('zmq');
    var constants = require('constants');
    var channelAssingRep = zmq.socket('rep'); 
    
    channelAssingRep.bind('tcp://*:' + constants.PORT_CHASKI_ASSIGNER);
    var module = {};
   
    channelAssingRep.on('message', function(data){
        console.log("receiced data for flitering new channel:" + data);
        opts.messageReceiver.addChannel(data);
    }); 
    
    return module;
};
