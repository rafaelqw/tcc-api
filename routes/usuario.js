var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule');
var bcrypt = require('bcryptjs');
var Usuario = models.Usuario;
var Autenticacao = models.Autenticacao;
var UsuarioEmpreendimento = models.UsuarioEmpreendimento;
var verificaToken = require('./verificaToken');

// router.use(verificaToken);

// POST Create Usuario
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createUsuario(res, req.body);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Create Usuario
async function createUsuario(res, usuarioData){
    try{
        var usuCadastrado = await Autenticacao.findOne({ where: {'email': usuarioData.email}});
        if(!usuCadastrado){
            var usuario = new Usuario();
            usuario.nome = usuarioData.nome;
            usuario.email = usuarioData.email;
            var usuarioSave = await usuario.save();

            var autenticacao = new Autenticacao();
            autenticacao.email = usuarioData.email;
            autenticacao.id_usuario = usuarioSave.id;
            
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(usuarioData.senha, salt);
            
            autenticacao.senha = hash;
            await autenticacao.save();

            for (let i = 0; i < usuarioData.empreendimentos.length; i++) {
                var usuarioEmpreendimento = new UsuarioEmpreendimento();
                usuarioEmpreendimento.id_usuario = usuarioSave.id;
                usuarioEmpreendimento.id_empreendimento = usuarioData.empreendimentos[i].id;
                await usuarioEmpreendimento.save();
            }
        }
        else {
            res.status(409).json({'msg':"Email já cadastrado!"});
        }

        res.status(201);
        res.json({'msg':"Usuário criado com sucesso"});
    }
    catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// GET usuarios
router.get('/', function(req, res, next) {
    getUsuarios(res);
});

// Fuction GET usuarios
async function getUsuarios(res){
    try {
        var usuarios = await usuario.findAll({});

        if(usuarios.length > 0) {
            res.status(200);
            res.json(usuarios);
        }
        else {
            res.status(404);
            res.json({'msg':"Nenhum registro encontrado"});
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// GET usuarios by Empreendimento
router.get('/id_empreendimento/:id_empreendimento', function(req, res, next) {
    getUsuariosByEmpreendimento(res, req.params.id_empreendimento);
});

// Fuction GET usuarios by Empreendimento
async function getUsuariosByEmpreendimento(res, id_empreendimento){
    try {
        var sqlQuery =  "SELECT usu.id, usu.nome, usu.email FROM tbl_usuario AS usu ";
            sqlQuery += "INNER JOIN tbl_usuario_empreendimento AS tue ON tue.id_usuario = usu.id ";
            sqlQuery += "WHERE tue.id_empreendimento = " + id_empreendimento + " ;";

        var usuarios = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

        if(usuarios.length > 0) {
            res.status(200);
            res.json(usuarios);
        }
        else {
            res.status(404);
            res.json({'msg':"Nenhum registro encontrado"});
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// DELETE usuario
router.delete('/:id',function(req, res, next) {
    deleteuUsuarioById(res, req.params.id);
});

// Function DELETE usuario
async function deleteuUsuarioById(res, id){
    try {
        var usuario = await usuario.findById(id);
        if(usuario){
            if(usuario.destroy({where: {id: usuario.id}})){
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
            res.json({'msg':"usuario não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

module.exports = router;