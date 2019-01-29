var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var RegistroSensor = models.RegistroSensor;

// Create RegistroSensor
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        req.body.sensores.forEach(sensor => {
            var registro = new RegistroSensor();
            registro.id_sensor = sensor.id;
            registro.valor = sensor.valor;
            registro.save();
        });
        res.status(201);
        res.send('');
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

// Get RegistroSensor
router.get('/', function(req, res, next) {
    RegistroSensor.findAll().then(items => {
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