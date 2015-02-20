module.exports = function(opts){
    
    // CHECK
    if(!opts || !opts.messageReceiver){
        throw new Error('message publisher needed');
    }
    var zmq = require('zmq');
    var constants = require('../constants');
    var channelAssignRep = zmq.socket('rep'); 
    
    channelAssignRep.bind('tcp://*:' + constants.PORT_CHASKI_ASSIGNER);
    var module = {};
    
    module.channelAssign = function channelAssign(channelId){
        opts.messageReceiver.addChannel(channelId);
    };
   
    channelAssignRep.on('message', function(data){
        channelAssignRep.send(['200', 'ok']);
        module.channelAssign(data);
    }); 

    
    module.close = function close(){
        channelAssignRep.close();
    };
    
    return module;
};
