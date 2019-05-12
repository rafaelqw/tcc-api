var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Sensor = models.Sensor;
var verificaToken = require('./verificaToken');

router.use(verificaToken);

// Create Sensor
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createSensor(res, req);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Create Sensor
async function createSensor(res, req){
    try {
        var newSensor = req.body.sensor;
        var sensor = new Sensor();
        sensor.nome = newSensor.nome;
        sensor.descricao = newSensor.descricao;
        sensor.id_tipo_sensor = newSensor.id_tipo_sensor;
        sensor.localizacao = newSensor.localizacao;
        sensor.id_dispositivo = newSensor.id_dispositivo;
        await sensor.save();
        res.status(201)
        res.json({'msg':"Usuario criado com sucesso"});
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// Get Sensor
router.get('/', function(req, res, next) {
    getSensores(res, req);
});

// Function GET Sensores
async function getSensores(res, req){
    try {
        var sensores = await Sensor.findAll();
        if(sensores.length > 0) {
            res.status(200);
            res.json(sensores);
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

module.exports = router;