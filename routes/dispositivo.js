var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Dispositivo = models.Dispositivo;
var verificaToken = require('./verificaToken');

router.use(verificaToken);

// POST Create Dispositivo
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createDispositivo(res, req);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Create Dispositivo
async function createDispositivo(res, req){
    try {
        var newDispositivo = req.body.dispositivo;
        var dispositivo = new Dispositivo();
        dispositivo.nome = newDispositivo.nome;
        dispositivo.descricao = newDispositivo.descricao;
        dispositivo.id_modelo = newDispositivo.id_modelo;
        dispositivo.id_empreendimento = newDispositivo.id_empreendimento;
        await dispositivo.save();
        res.status(201)
        res.json({'msg':"Usuario criado com sucesso"});    
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// Get Dispositivo
router.get('/', function(req, res, next) {
    getDispositivos(res, req);
});

// Function GET Dispositivo
async function getDispositivos(res, req){
    try {
        var dispositivos = await Dispositivo.findAll();
        if(dispositivos.length > 0) {
            res.status(200);
            res.json(dispositivos);
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

// DELETE Dispositivo
router.delete('/:id',function(req, res, next) {
    deleteDispositivoById(res, req.params.id);
});

// Function DELETE Dispositivo
async function deleteDispositivoById(res, id){
    try {
        var dispositivo = await Dispositivo.findById(id);
        if(dispositivo){
            if(dispositivo.destroy({where: {id: dispositivo.id}})){
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
            res.json({'msg':"Dispositivo não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

module.exports = router;