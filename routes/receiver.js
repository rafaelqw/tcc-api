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

// Create Dispositivo
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        var receiver = req.body;
        var registro = new Receiver();
        registro.registration_id = receiver.registration_id;
        registro.id_usuario = receiver.id_usuario;
        registro.flg_notificacao_ativa = receiver.flg_notificacao_ativa;
        registro.save();
        res.status(201);
        res.send('');
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

// Get Dispositivo
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

module.exports = router;