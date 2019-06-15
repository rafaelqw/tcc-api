var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Receiver = models.Receiver;
var verificaToken = require('./verificaToken');

router.use(verificaToken);

// Create Receiver
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createReceiver(res, req.body);
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

// Function POST Create Receiver
async function createReceiver(res, receiver){
    try{
        var registro = new Receiver();
        registro.registration_id = receiver.registration_id;
        registro.device_name = receiver.device_name;
        registro.id_usuario = receiver.id_usuario;
        registro.flg_notificacao_ativa = receiver.flg_notificacao_ativa;
        await registro.save();
        res.status(201);
        res.json({'msg':"Receiver criado com sucesso"});
    }
    catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// Get Receiver
router.get('/', function(req, res, next) {
    Receiver.findAll().then(items => {
		if(items.length > 0) {
            res.json(items);
        }
        else {
            res.status(404);
            res.send('');
        }
	});
});

// Get Receiver by id_usuario e registration_id
router.get('/:id_usuario/:registration_id', function(req, res, next) {
    getReceiverByUsuario(res, req.params.id_usuario, req.params.registration_id);
});

// Function GET Receiver by id_usuario e registration_id
async function getReceiverByUsuario(res, id_usuario, registration_id){
    try {
        var receiver = await Receiver.findOne({where:{
            "id_usuario": id_usuario,
            "registration_id": registration_id
        }});
        if(receiver) {
            res.status(200);
            res.json(receiver);
        }
        else {
            res.status(404);
            res.json({'msg':"Nenhum registro encotrado"});
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// PUT Receiver by id_usuario e registration_id
router.put('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        PutReceiverByUsuario(res, req.body);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function PUT Receiver by id_usuario e registration_id
async function PutReceiverByUsuario(res, data){
    try {
        var receiver = await Receiver.findOne({where:{
            "id_usuario": data.id_usuario,
            "registration_id": data.registration_id
        }});

        await receiver.update({
            "flg_notificacao_ativa": data.flg_notificacao_ativa
        });
        res.status(200);
        res.json(receiver);
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}


module.exports = router;