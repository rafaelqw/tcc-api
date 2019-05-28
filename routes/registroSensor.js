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
        //createRegistroSensor(res, req)
        teste(res);
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

// Function POST Create RegistroSensor
async function teste(res){
    try {
        var date = moment().format('YYYY-MM-DD HH');
        for (let i = 0; i < 25; i++) {
            var registro = new RegistroSensor();
            registro.id_sensor = 2;
            registro.valor = i * 10;
            registro.createdAt = moment(date).format('YYYY-MM-DD HH:mm');
            await registro.save();
            date = moment(date).subtract(60,'m');
        }
        res.status(201)
        res.json({'msg':"registro criado com sucesso"});    
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

// Get RegistroSensores
router.get('/graphic/:sensor/:periodo', function(req, res, next) {
    getRegistroSensoresPeriod(res, req.params.sensor, req.params.periodo);
});

async function getRegistroSensoresPeriod(res, sensor, periodo = 60){
    try {
        var pontos = [];
        var date = moment().format('YYYY-MM-DD HH');
        console.log(date)
        for (let i = 0; i < 24; i++) {
            var startDate = moment(date).format('YYYY-MM-DD HH:mm');
            var endDate = moment(date).add(1,'m').format('YYYY-MM-DD HH:mm');
            var registroSensor = await RegistroSensor.findAll({
                attributes: [[models.sequelize.fn('AVG', models.sequelize.col('valor')), 'medValor']],
                where:{
                    id_sensor: sensor,
                    createdAt: {
                        [Op.between]: [startDate, endDate]
                    } 
                }
            });
            var ponto = {
                label: moment(date).format('HH:mm'),
                data:  (registroSensor[0].dataValues.medValor != null) ? parseFloat(registroSensor[0].dataValues.medValor) : 0
            }
            pontos.push(ponto);
            date = moment(date).subtract(periodo,'m');
        }
        if(pontos.length > 0) {
            res.status(200);
            res.json(pontos);
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