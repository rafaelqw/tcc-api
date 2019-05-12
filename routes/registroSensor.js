var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var RegistroSensor = models.RegistroSensor;
var verificaToken = require('./verificaToken');

router.use(verificaToken);

// POST Create RegistroSensor
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createRegistroSensor(res, req)
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Create RegistroSensor
async function createRegistroSensor(res, req){
    try {
        var registros = req.body;
        for (let i = 0; i < registros.length; i++) {
            const newRegistro = registros[i];
            var registro = new RegistroSensor();
            registro.id_sensor = newRegistro.id;
            registro.valor = newRegistro.valor;
            await registro.save();
        }
        res.status(201)
        res.json({'msg':"Usuario criado com sucesso"});    
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// Get RegistroSensores
router.get('/', function(req, res, next) {
    getRegistroSensores(res, req);
});

// Function GET RegistroSensores
async function getRegistroSensores(res, req){
    try {
        var registroSensor = await RegistroSensor.findAll();
        if(registroSensor.length > 0) {
            res.status(200);
            res.json(registroSensor);
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

// DELETE RegistroSensor
router.delete('/:id',function(req, res, next) {
    deleteRegistroSensorById(res, req.params.id);
});

// Function DELETE RegistroSensor
async function deleteRegistroSensorById(res, id){
    try {
        var registroSensor = await RegistroSensor.findById(id);
        if(registroSensor){
            if(registroSensor.destroy({where: {id: registroSensor.id}})){
                res.status(204);
                res.json({'msg':"Registro deletado com sucesso"});
            }
            else{
                res.status(404);
                res.json({'msg':"Falha ao deletar registro"});
            }
        }
        else{
            res.status(406);
            res.json({'msg':"registro do Sensor não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

module.exports = router;