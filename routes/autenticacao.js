var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Autenticacao = models.Autenticacao;
var bcrypt = require('bcryptjs');

router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        loginUsuario(res,req.body);
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

async function loginUsuario(res, data){
    try {
        var usuCadastrado = await Autenticacao.findOne({ where: {'email': data.email}});
        if(usuCadastrado){
            usuCadastrado = usuCadastrado.dataValues;
            if(bcrypt.compareSync(data.senha, usuCadastrado.senha)){
                res.status(200).json({'login':true});
            }
            else{
                res.status(404).json({'msg':"Senha inválida!"});
            }
        }
        else{
            res.status(404).json({'msg':"Email informado não cadastrado!"});
        } 
    } catch (error) {
        res.status(404).send('Falha na requisição');
        console.log(error);
    }
}

router.post('/new', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createUsuario(res,req.body);   
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

async function createUsuario(res, data){
    try {
        var usuCadastrado = await Autenticacao.findOne({ where: {'email': data.email}});
        if(!usuCadastrado){
            var autenticacao = new Autenticacao();
            autenticacao.email = data.email;
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(data.senha, salt);
            autenticacao.senha = hash;
            await autenticacao.save();
        }
        else{
            res.status(404).json({'msg':"Email já cadastrado!"});
        } 
    } catch (error) {
        res.status(404).send('Falha na requisição');
        console.log(error);
    }
}

module.exports = router;