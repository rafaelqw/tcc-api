var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Sensor = models.Sensor;
var TipoSensor = models.TipoSensor;
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
        res.json({'msg':"Sensor criado com sucesso"});
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

// Get Sensor by ID
router.get('/id/:id_empreendimento/:id_sensor', function(req, res, next) {
    getSensoresbyId(res, req.params.id_empreendimento, req.params.id_sensor);
});

// Function GET Sensores by ID
async function getSensoresbyId(res, id_empreendimento, id_sensor){
    try {
        var sqlQuery =  "SELECT ts.*, td.nome as dispositivo, tts.tipo_sensor FROM tbl_sensor AS ts ";
            sqlQuery += "INNER JOIN tbl_dispositivo AS td ON td.id = ts.id_dispositivo ";
            sqlQuery += "INNER JOIN tbl_empreendimento AS te ON te.id = td.id_empreendimento ";
            sqlQuery += "INNER JOIN tbl_tipo_sensor AS tts ON tts.id = ts.id_tipo_sensor ";
            sqlQuery += "WHERE te.id = " + id_empreendimento + " ";
            sqlQuery += "  AND ts.id = " + id_sensor + " ";
            sqlQuery += "  AND ts.deletedAt is null AND td.deletedAt is null AND te.deletedAt is null ";

        var sensores = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

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

// Get Sensor by Empreendimento
router.get('/empre/:id_empreendimento', function(req, res, next) {
    getSensoresbyEmpreendimento(res, req.params.id_empreendimento);
});

// Function GET Sensores by Empreendimento
async function getSensoresbyEmpreendimento(res, id_empreendimento){
    try {
        var sqlQuery =  "SELECT ts.*, td.nome as dispositivo, tts.tipo_sensor FROM tcc_db.tbl_sensor AS ts "
            sqlQuery += "INNER JOIN tbl_dispositivo AS td ON td.id = ts.id_dispositivo "
            sqlQuery += "INNER JOIN tbl_empreendimento AS te ON te.id = td.id_empreendimento "
            sqlQuery += "INNER JOIN tbl_tipo_sensor AS tts ON tts.id = ts.id_tipo_sensor ";
            sqlQuery += "WHERE te.id = " + id_empreendimento + " ";
            sqlQuery += "  AND ts.deletedAt is null AND td.deletedAt is null AND te.deletedAt is null ";

        var sensores = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

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

// Get Sensor by Dispositivo
router.get('/disp/:id_empreendimento/:id_dispositivo', function(req, res, next) {
    getSensoresbyDispositivo(res, req.params.id_empreendimento, req.params.id_dispositivo);
});

// Function GET Sensores by Dispositivo
async function getSensoresbyDispositivo(res, id_empreendimento, id_dispositivo){
    try {
        var sqlQuery =  "SELECT ts.*, td.nome as dispositivo, tts.tipo_sensor FROM tcc_db.tbl_sensor AS ts ";
            sqlQuery += "INNER JOIN tbl_dispositivo AS td ON td.id = ts.id_dispositivo ";
            sqlQuery += "INNER JOIN tbl_empreendimento AS te ON te.id = td.id_empreendimento ";
            sqlQuery += "INNER JOIN tbl_tipo_sensor AS tts ON tts.id = ts.id_tipo_sensor ";
            sqlQuery += "WHERE te.id = " + id_empreendimento + " ";
            sqlQuery += "   AND td.id = " + id_dispositivo + " ";
            sqlQuery += "  AND ts.deletedAt is null AND td.deletedAt is null AND te.deletedAt is null ";

        var sensores = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

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

// DELETE Receiver
router.delete('/:id',function(req, res, next) {
    deleteSensor(res, req.params.id);
});

// Function DELETE Sensor
async function deleteSensor(res, id_Sensor){
    try {
        var sensor = await Sensor.findById(id_Sensor);
        if(sensor){
            if(sensor.destroy({where: {id: sensor.id}})){
                res.status(204);
                res.json({'msg':"Sensor deletado com sucesso"});
            }
            else{
                res.status(404);
                res.json({'msg':"Falha ao deletar Sensor"});
            }
        }
        else{
            res.status(406);
            res.json({'msg':"Sensor do Sensor não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// GET Modelos
router.get('/tipo_sensor',function(req, res, next) {
    getTipoSensor(res);
});

async function getTipoSensor(res){
    try {
        var tipoSensor = await TipoSensor.findAll();
        if(tipoSensor.length > 0) {
            res.status(200);
            res.json(tipoSensor);
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