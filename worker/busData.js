module.exports = function(options){
    var opts = options || {};
    var logHandler = require('../logHandler.js');
    var log = logHandler({name:'message-receiver', log:opts.log});   
    // CHECKS
    if(!opts.messagePublisher){
        throw new Error('message publisher needed');
    }
    if(!opts.atahualpas){
        throw new Error('atahualpas ips needed');
    }
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var atahualpas = opts.atahualpas;

    var receiversSubs = [];
    var messagePublisher = opts.messagePublisher;
   
    //exposes module and it's functions 
    var module = {info: "message receiver module"};

    //make every sub receive from atahualpas for that channel
    module.addChannel = function addChannel(channelId){
        log.info('chaski is now listenint to channel', channelId);
        for(var i = 0; i < receiversSubs.length; i++){
            receiversSubs[i].subscribe(channelId);
        }
    };
    
    module.close = function close(){
        log.info('closing chaski subs');
        for(var i = 0; i < receiversSubs.length; i++){
            receiversSubs[i].close();
        }
    };

    //handle messages send from atahualpa
    var onMessageCallback = function(to, from, apikey, data){
        log.info('got a message, publishing it', to.toString(), from.toString(), apikey.toString(), data.toString());
        messagePublisher.send(to.toString(), from.toString(), data.toString());
    };


    //subscribe to every atahualpa
    for(var i=0; i < atahualpas.length; i++){
        var messageReceiverSub = zmq.socket('sub'); 
        var atahualpaUrl = 'tcp://' + atahualpas[i].ip+ ':' + constants.PORT_PUB_SUB_ATAHUALPA_CHASKI_MESSAGES;
        log.info('chaski subsribing to url', atahualpaUrl);
        messageReceiverSub.connect(atahualpaUrl);
        messageReceiverSub.on('message', onMessageCallback); 
        receiversSubs.push(messageReceiverSub);
    } 
   
    return module;
};
