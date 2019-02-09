var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Cliente = models.Cliente;
var PessoaFisica = models.PessoaFisica;
var PessoaJuridica = models.PessoaJuridica;
var Telefone = models.Telefone;
var Estado = models.Estado;
var Municipio = models.Municipio;


// POST Create Cliente
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createCliente(res, req.body);
    }
    else{
        res.status(400);
        res.json({'msg':"Corpo da requesição vazio"});
    }
});

// Function POST Create Cliente
async function createCliente(res, cliente){
    try{
        var clienteData = cliente;
        var cliente = new Cliente();
        cliente.email = clienteData.email;
        cliente.cep = clienteData.cep;
        cliente.logradouro = clienteData.logradouro;
        cliente.numero = clienteData.numero;
        cliente.bairro = clienteData.bairro;
        cliente.complemento = clienteData.complemento;
        cliente.id_estado = clienteData.id_estado;
        cliente.id_municipio = clienteData.id_municipio;
        var clienteSave = await cliente.save();
        if(clienteData.tipo_cadastro == "pf"){
            var pessoaFisica = new PessoaFisica();
            pessoaFisica.id_cliente = clienteSave.id;
            pessoaFisica.nome = clienteData.nome;
            pessoaFisica.cpf = clienteData.cpf;
            pessoaFisica.rg = clienteData.rg;
            pessoaFisica.data_nascimento = clienteData.data_nascimento;
            pessoaFisica.sexo = clienteData.sexo;
            await pessoaFisica.save();
        }
        else if(clienteData.tipo_cadastro == "pj"){
            var pessoaJuridica = new PessoaJuridica();
            pessoaJuridica.id_cliente = clienteSave.id;
            pessoaJuridica.nome_fantasia = clienteData.nome_fantasia;
            pessoaJuridica.razao_social = clienteData.razao_social;
            pessoaJuridica.cnpj = clienteData.cnpj;
            pessoaJuridica.inscricao_estadual = clienteData.inscricao_estadual;
            await pessoaJuridica.save();
        }

        var telefone = new Telefone();
        telefone.id_cliente = clienteSave.id;
        telefone.id_tipo = clienteData.id_tipo;
        telefone.ddd = clienteData.ddd;
        telefone.numero_tel = clienteData.numero_tel;
        await telefone.save();        

        res.status(201)
        res.json({'msg':"Usuario criado com sucesso"});
    }
    catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

// GET Clientes
router.get('/', function(req, res, next) {
    getClientes(res);
});

// Fuction GET Clientes
async function getClientes(res){
    try {
        var clientes = await Cliente.findAll({
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
        });

        /*var retorno = [];
        for(var i = 0; i < clientes.length; i++) {
            var estado = await Estado.findById(clientes[i].id_estado)
            var municipio = await Municipio.findById(clientes[i].id_municipio)
            var item = clientes[i].dataValues;
            item.estado = estado.dataValues;
            item.municipio = municipio.dataValues;
            retorno.push(item);
        }*/

        if(clientes.length > 0) {
            res.status(200);
            res.json(clientes);
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

// DELETE Cliente
router.delete('/:id',function(req, res, next) {
    deleteClientesById(res, req.params.id);
});

// Function DELETE Cliente
async function deleteClientesById(res, id){
    try {
        var cliente = await Cliente.findById(id);
        if(cliente){
            if(cliente.destroy({where: {id: cliente.id}})){
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
            res.json({'msg':"Cliente não encontrado"}); 
        }
    } catch (error) {
        res.status(404);
        res.json({'msg':"Falha na requisição", 'error': error});
    }
}

module.exports = router;