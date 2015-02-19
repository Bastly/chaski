module.exports = function(){
    
    var zmq = require('zmq');
    var constants = require('../constants');
    var clientPingsPub = zmq.socket('pub'); 
    console.log( 'tcp://*:' + constants.PORT_CLIENT_PINGS);
    clientPingsPub.bind('tcp://*:' + constants.PORT_CLIENT_PINGS);
    var module = {};
   
    function pingClients (){
        console.log("pinging clients"); 
        clientPingsPub.send(['ping', 'ping']);
    }
     
    setInterval(pingClients, 500);
    
    return module;
};
