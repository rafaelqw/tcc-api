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
    try {
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
                //res.status(404)
                //res.json({'msg':"Falha no envio da notificação"});
            }else {
                console.log('response here', response);
                //res.status(201)
                //res.json({'msg':"Notificação enviada com sucesso"});
            }
        })
    } catch (error) {
            
    }
}

router.post('/sensor', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        sendNotificationEmpre(res, req.body);
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

async function sendNotificationEmpre(res, data){
    try {
        var sqlQuery =  "SELECT * FROM tbl_receiver AS tr ";
            sqlQuery += "INNER JOIN tbl_user_empreendimento AS tue  ON tue.id_user = tr.id_usuario ";
            sqlQuery += "INNER JOIN tbl_dispositivo         AS td   ON td.id_empreendimento = tue.id_empreendimento ";
            sqlQuery += "INNER JOIN tbl_sensor              AS ts   ON ts.id_dispositivo = td.id ";
            sqlQuery += "WHERE ts.id = " + data.id_sensor + " ";
            sqlQuery += "AND tr.flg_notificacao_ativa = true ";
            sqlQuery += "AND tr.deletedAt is null ";
            sqlQuery += "AND tue.deletedAt is null ";
            

        var receivers = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

        await receivers.forEach(async receiver => {
            var noti = {
                registration_id: receiver.registration_id,
                title: data.title,
                body: data.body
            }

            await sendNotificationTo(res, noti);
        });

        res.status(201)
        res.json({'msg':"Notificações enviadas com sucesso"});

    } catch (error) {
        res.status(404)
        res.json({'msg':"Falha no envio da notificação"});
    }
}

module.exports = router;