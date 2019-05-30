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