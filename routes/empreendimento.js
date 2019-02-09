var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Empreendimento = models.Empreendimento;

// Create RegistroSensor
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        var empreendimento = req.body;
        var registro = new Empreendimento;
        registro.nome = empreendimento.nome;
        registro.descricao = empreendimento.descricao;
        registro.cnpj = empreendimento.cnpj;
        registro.cep = empreendimento.cep;
        registro.logradouro = empreendimento.logradouro;
        registro.numero = empreendimento.numero;
        registro.bairro = empreendimento.bairro;
        registro.id_estado = empreendimento.id_estado;
        registro.id_municipio = empreendimento.id_municipio;
        registro.id_segmento = empreendimento.id_segmento;
        registro.id_porte = empreendimento.id_porte;
        registro.id_cliente = empreendimento.id_cliente;
        registro.save();

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
    Empreendimento.findAll().then(items => {
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