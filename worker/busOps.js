module.exports = function(options){
    var opts = options || {};
    var logHandler = require('../logHandler.js');
    var log = logHandler({name:'busOps', log:opts.log});   
    if(!opts.atahualpas){
        throw new Error('atahualpas ips needed');
    }
    if(!opts.busData){
        throw new Error('bus data needed');
    }
    if(!opts.chaskiId){
        throw new Error('chaskiId needed');
    }
    var zmq = require('zmq');
    var constants = require('bastly_constants');
    var atahualpas = opts.atahualpas;

    var receiversSubs = [];
   
    //exposes module and it's functions 
    var module = {info: "module bus ops"};

    module.close = function close(){
        for(var i = 0; i < receiversSubs.length; i++){
            receiversSubs[i].close();
        }
    };

    //handle messages send from atahualpa
    var onMessageCallback = function(thisChaskiId, to){
        log.info('chaski got listen OPS:', to.toString());
        opts.busData.addChannel(to.toString());
    };

    //subscribe to every atahualpa
    log.info('subscribing to atahualapas:');
    for(var i=0; i < atahualpas.length; i++){
        var messageReceiverSub = zmq.socket('sub'); 
        var receiverURL =  'tcp://' + atahualpas[i].ip+ ':' + constants.PORT_PUB_SUB_ATAHUALPA_CHASKI_OPS;
        log.info('chaski-connector message receiver listening at:' + receiverURL);
        messageReceiverSub.connect(receiverURL);
        messageReceiverSub.on('message', onMessageCallback); 
        //listen to orders from atahualpa for this chaskiId
        log.info('chaski-connector subscribing to this chaskiId:' + opts.chaskiId);
        messageReceiverSub.subscribe(opts.chaskiId);
        receiversSubs.push(messageReceiverSub);
    } 
   
    

    return module;
};
