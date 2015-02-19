module.exports = function(){
    
    var zmq = require('zmq');
    var constants = require('constants');
    var clientPingsPub = zmq.socket('pub'); // publishing channel to forward messages that should be handled by workers.
    
    clientPingsPub.bind('tcp://*:' + constants.CLIENT_PINGS);
    var module = {};
   
    function pingClients (){
        //TODO change for bunyan
        console.log("pinging clients"); 
        clientPingsPub.send('ping');
    }
     
    setInterval(pingClients, 5000);
    
    return module;
};
