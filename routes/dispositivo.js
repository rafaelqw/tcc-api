var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Dispositivo = models.Dispositivo;

// Create Dispositivo
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        var dispositivo = req.body.dispositivo;
        var registro = new Dispositivo();
        registro.nome = dispositivo.nome;
        registro.descricao = dispositivo.descricao;
        registro.id_modelo = dispositivo.id_modelo;
        registro.id_empreendimento = dispositivo.id_empreendimento;
        registro.save();
        res.status(201);
        res.send('');
    }
});

// Get Dispositivo
router.get('/', function(req, res, next) {
    Dispositivo.findAll().then(items => {
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