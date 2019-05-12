var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var verificaToken = require('./verificaToken');
var FCM = require('fcm-node');
var serverKey = require('../config/privatekey.json') //put the generated private key path here    
var fcm = new FCM(serverKey)

router.use(verificaToken);

router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        sendNotificationTo(res, req.body);
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

async function sendNotificationTo(res, data){
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: data.registration_id, 
        notification: {
            title: data.title, 
            body: data.body 
        },
        data: {  //you can send only notification or only data(or include both)
            id: 'teste',
        }
    }
 
    await fcm.send(message, function(err, response) {
        if(err){
            console.log('error found', err);
            res.status(404)
            res.json({'msg':"Falha no envio da notificação"});
        }else {
            console.log('response here', response);
            res.status(201)
            res.json({'msg':"Notificação enviada com sucesso"});
        }
    })
}

module.exports = router;