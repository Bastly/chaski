module.exports = function(options){
    var opts = options || {}; 

    var logHandler = require('../logHandler');
    var log = logHandler({name:'messagePublisher', log:opts.log});
    if(!opts || !opts.io){
        log.info('io must be given');
        throw new Error('io needed');
    }
    var io =  opts.io;
    var module = {"info":"this is a clientPings module"};
   
    function pingClients (){
        io.emit('ping', 'ping');
    }
     
    var interval = setInterval(pingClients, 500);

    module.close = function close(){
        clearInterval(interval);
    };
    
    return module;
};
