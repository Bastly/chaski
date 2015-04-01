module.exports = function(options){
   
    var opts = options || {}; 
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var clientPingsPub = zmq.socket('pub'); 
    var logHandler = require('../logHandler');
    var log = logHandler({name:'clientPings', log:opts.log});

    var bindUrl = 'tcp://*:' + constants.PORT_PUB_SUB_CHASKI_CLIENT_PINGS;
    log.info('binding to:' + bindUrl);
    clientPingsPub.bind(bindUrl);
    var module = {};
   
    function pingClients (){
        log.debug('sending pings');
        clientPingsPub.send(['ping', 'ping']);
    }
    
    var deltaT = 500;
    log.info('setting pings every:' + deltaT); 
    setInterval(pingClients, deltaT);


    module.close = function close(){
        log.info('closing pings');
        clientPingsPub.close();
    };
    
    return module;
};
