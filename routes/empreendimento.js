var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require('underscore');
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Empreendimento = models.Empreendimento;
var verificaToken = require('./verificaToken');

router.use(verificaToken);

// POST Empreendimento
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createEmpreendimento(res,req.body);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Empreendimento
async function createEmpreendimento(res, empreendimento){
    try {
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
        registro.complemento = empreendimento.complemento;
        await registro.save();

        res.status(201)
        res.json({'msg':"Empreendimento criado com sucesso"});
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});  
    }
}


// GET Empreendimentos
router.get('/', function(req, res, next) {
    getEmpreendimento(res);
});

// Function GET Empreendimentos
async function getEmpreendimento(res){
    try {
        var Empreendimentos = await Empreendimento.findAll({
            include: [
                {
                    model: models.Cliente,
                    require: true,
                    include: [
                        {
                            model: models.PessoaJuridica,
                            required: false
                        },{
                            model: models.PessoaFisica,
                            required: false
                        },{
                            model: models.Telefone,
                            required: false
                        },{
                            model: models.Estado,
                            require: true
                        },{
                            model: models.Municipio,
                            require: true
                        }
                    ]
                },{
                    model: models.Estado,
                    require: true
                },{
                    model: models.Municipio,
                    require: true
                }
            ]
        });
        if(Empreendimentos.length > 0) {
            res.status(200);
            res.json(Empreendimentos);
        }
        else {
            res.status(404);
            res.json({'msg':"Nenhum registro encontrado"});
        }
    } catch (error) {
        
    }
}

// Get Empreendimento by id_usuario
router.get('/id_usuario/:id_usuario', function(req, res, next) {
    getEmpreendimentoByIdUsuario(res, req.params.id_usuario);
});

// Function GET Sensores by ID
async function getEmpreendimentoByIdUsuario(res, id_usuario){
    var empreendimentos = [];
    try {
        var sqlQuery =  "SELECT te.*, tep.porte, tes.segmento, pf.nome as nome_cliente, pf.rg, pf.cpf, pf.data_nascimento, pf.sexo, pj.razao_social, pj.nome_fantasia, pj.cnpj, pj.inscricao_estadual FROM tbl_empreendimento AS te ";
            sqlQuery += "INNER JOIN tbl_usuario_empreendimento AS tue ON tue.id_empreendimento = te.id ";
            sqlQuery += "INNER JOIN tbl_empreendimento_porte as tep on tep.id = te.id_porte ";
            sqlQuery += "INNER JOIN tbl_empreendimento_segmento as tes on tes.id = te.id_segmento ";
            sqlQuery += "INNER JOIN tbl_cliente as tc on tc.id = te.id_cliente ";
            sqlQuery += "LEFT JOIN tbl_pessoa_fisica pf on pf.id_cliente = tc.id ";
            sqlQuery += "LEFT JOIN tbl_pessoa_juridica pj on pj.id_cliente  = tc.id ";
            sqlQuery += "where tue.id_usuario = " + id_usuario + " ";
            sqlQuery += " and pf.deletedAt is null and pj.deletedAt is null and te.deletedAt is null and tue.deletedAt is null ;";

        var empreendimentos = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT});

        if(empreendimentos.length > 0) {
            res.status(200);
            res.json(empreendimentos);
        }
        else{
            res.status(404);
            res.json({'msg':"Nenhum registro encontrado"}); 
        }   
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// DELETE Empreendimento
router.delete('/:id',function(req, res, next) {
    deleteEmpreendimentosById(res,req.params.id);
});

// Function DELETE Empreendimento
async function deleteEmpreendimentosById(res,id){
    try {
        var empreendimento = await Empreendimento.findById(id);
        if(empreendimento){
            if(empreendimento.destroy({where: {id: empreendimento.id}})){
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
            res.json({'msg':"Empreendimento não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}
module.exports = router;