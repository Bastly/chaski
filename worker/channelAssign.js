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
   
    channelAssignRep.on('message', function(data){
        channelAssignRep.send(['200', 'ok']);
        opts.messageReceiver.addChannel(data);
    }); 
    
    module.close = function close(){
        channelAssignRep.close();
    };
    
    return module;
};
