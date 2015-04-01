module.exports = function(options){
    var opts = options || {}; 

    var logHandler = require('../logHandler');
    var log = logHandler({name:'messagePublisher', log:opts.log});
    if(!opts || !opts.io){
        log.info('io must be given');
        throw new Error('io needed');
    }
    var io =  opts.io;
    
    var module = {"info":"this is a messagePublisher module"};
    
    module.send = function send(topic, message){
        log.info('sending message', topic, message);
        io.emit(topic, message);
    };
    
    module.close = function close(){
        messagePublisherPub.close();
    };
    
    return module;
};
