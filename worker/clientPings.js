module.exports = function(){
    
    var zmq = require('zmq');
    var constants = require('../constants');
    var clientPingsPub = zmq.socket('pub'); 
    clientPingsPub.bind('tcp://*:' + constants.PORT_CLIENT_PINGS);
    var module = {};
   
    function pingClients (){
        clientPingsPub.send(['ping', 'ping']);
    }
     
    setInterval(pingClients, 500);
    
    return module;
};
