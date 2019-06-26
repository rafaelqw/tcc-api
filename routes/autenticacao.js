var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Autenticacao = models.Autenticacao;
var Receiver = models.Receiver;
var Empreendimento = models.Empreendimento;
var UsuarioEmpreendimento = models.UsuarioEmpreendimento;
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var verificaToken = require('./verificaToken');

var timeToken = 60 * 60;

router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        loginUsuario(res,req.body,req.headers);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

async function loginUsuario(res, data, headers){
    try {
        var sqlQuery =  " SELECT ta.id, ta.id_usuario, tu.nome, ta.senha FROM tbl_autenticacao AS ta ";
            sqlQuery += " INNER JOIN tbl_usuario AS tu ON tu.id = ta.id_usuario ";
            sqlQuery += " WHERE ta.email = '"+data.email+"' ";
            sqlQuery += "   AND ta.deletedAt is null AND tu.deletedAt is null";

        var aut = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});
        aut = aut[0];
        if(aut){
            if(bcrypt.compareSync(data.senha, aut.senha)){

                var timeToken = 60 * 60;
                if(headers.device == "mobile"){
                    timeToken = 60 * 60;
                    var token = jwt.sign({ id: aut.id }, config.jwtSecretDevice , {
                        expiresIn: timeToken // expires in 1min
                    });
                } else{
                    var token = jwt.sign({ id: aut.id }, config.jwtSecret , {
                        expiresIn: timeToken // expires in 1min
                    });
                }
                
                res.status(202).json(
                    {'login':true,
                    'msg':"Logado com Sucesso!", 
                    "token": token, 
                    "id_usuario":aut.id_usuario,
                    "nome_usuario":aut.nome,
                    "empreendimentos": await getEmpreendimentoByUsuario(aut.id_usuario),
                    "notification": await getReceiver(aut.id,data.tokenFCM)
                });

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

async function getReceiver(id_usuario,tokenFCM){
    var receiver = await Receiver.findOne({ where: {'id_usuario': id_usuario, 'registration_id': tokenFCM}});
    var notification = false;
    (receiver == null) ? notification = true : notification = false;
    return notification;
}

async function getEmpreendimentoByUsuario(id_usuario){
    var empreendimentos = [];
    try {
        var sqlQuery =  " SELECT te.*, tep.porte, tes.segmento FROM tbl_empreendimento AS te ";
            sqlQuery += " INNER JOIN tbl_usuario_empreendimento AS tue ON tue.id_empreendimento = te.id ";
            sqlQuery += " INNER JOIN tbl_empreendimento_porte as tep on tep.id = te.id_porte ";
            sqlQuery += " INNER JOIN tbl_empreendimento_segmento as tes on tes.id = te.id_segmento ";
            sqlQuery += " where tue.id_usuario = " + id_usuario + " ";
            sqlQuery += " AND te.deletedAt is null AND tue.deletedAt is null ;";

        var empreendimentos = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

        if(empreendimentos.length > 0) {
            return empreendimentos;
        }
        else {
            return null
        }   
    } catch (error) {
        return null
    }
}

router.post('/refresh-token', function(req, res){
    refreshToken(res,req);
});

async function refreshToken(res,req){
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ msg: 'Token não enviado na requisição', erro: 1 });

    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({ msg: 'Token inválido'});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).send({ msg: 'Token mal formatado' });
    }

    jwt.verify(token, config.jwtSecret, function(err, decoded) {
        if (err) return res.status(401).send({ msg: 'Falha na validação do Token', erro: err });

        req.id_usuario = decoded.id;
        
        var token = jwt.sign({ id: req.id }, config.jwtSecret , {
            expiresIn: timeToken // expires in 15min
        });
    
        res.status(200).json({"token": token});
    });
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