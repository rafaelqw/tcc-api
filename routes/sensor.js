var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Sensor = models.Sensor;

// Create Sensor
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        var sensor = req.body.sensor;
        var registro = new Sensor();
        registro.nome = sensor.nome;
        registro.descricao = sensor.descricao;
        registro.id_tipo_sensor = sensor.id_tipo_sensor;
        registro.localizacao = sensor.localizacao;
        registro.id_dispositivo = sensor.id_dispositivo;
        registro.save();
        res.status(201);
        res.send('');
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

// Get Sensor
router.get('/', function(req, res, next) {
    Sensor.findAll().then(items => {
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