module.exports = function(){
    
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var clientPingsPub = zmq.socket('pub'); 
    clientPingsPub.bind('tcp://*:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_PINGS);
    var module = {};
   
    function pingClients (){
        clientPingsPub.send(['ping', 'ping']);
    }
     
    setInterval(pingClients, 500);


    module.close = function close(){
        clientPingsPub.close();
    };
    
    return module;
};
