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
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var verificaToken = require('./verificaToken');

router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        loginUsuario(res,req.body);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

async function loginUsuario(res, data){
    try {
        var usuCadastrado = await Autenticacao.findOne({ where: {'email': data.email}});
        if(usuCadastrado){
            usuCadastrado = usuCadastrado.dataValues;
            if(bcrypt.compareSync(data.senha, usuCadastrado.senha)){
                var timeToken = 15 * 60;
                var token = jwt.sign({ id: usuCadastrado.id }, config.jwtSecret , {
                    expiresIn: timeToken // expires in 1min
                });
                res.status(202).json({'login':true,'msg':"Logado com Sucesso!", "token": token});
            }
            else{
                res.status(202).json({'login':false,'msg':"Senha inválida!"});
            }
        }
        else{
            res.status(202).json({'login':false, 'msg':"Email informado não cadastrado!"});
        } 
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

router.post('/new', function(req, res, next) {
    if(verificaToken(req, res, next)){
        if(Object.keys(req.body).length > 0){
            createUsuario(res,req.body);   
        }
        else{
            res.status(400);
            res.json({'msg':"Corpo da requesição vazio"});
        }
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
            res.status(201).json({'msg':"Usuario criado com sucesso"});
        }
        else{
            res.status(201).json({'msg':"Email já cadastrado!"});
        } 
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

module.exports = router;