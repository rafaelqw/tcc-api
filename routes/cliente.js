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


// Create Dispositivo
router.post('/', function(req, res, next) {
    if(Object.keys(req.body).length > 0){
        createCliente(res, req.body);
    }
    else{
        res.status(404);
        res.send('Corpo da requesição vazio');
    }
});

async function createCliente(res, cliente){
    var clienteData = cliente;
        var cliente = new Cliente();
        cliente.email = clienteData.email;
        cliente.cep = clienteData.cep;
        cliente.logradouro = clienteData.logradouro;
        cliente.numero = clienteData.numero;
        cliente.bairro = clienteData.bairro;
        cliente.complemento = clienteData.complemento;
        cliente.id_estado = clienteData.id_estado;
        cliente.id_cidade = clienteData.id_cidade;
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

        res.status(201);
        res.send('');
}

// Get Dispositivo
router.get('/', function(req, res, next) {
    Cliente.findAll({
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
            }
        ]
    }).then(items => {
		if(items.length > 0) {
            res.json(items);
        }
        else {
            res.status(404);
            res.send('');
        }
	});
});

router.delete('/',function(req, res, next) {
    Cliente.findById(req.query.id).then(item => {
        if(item != null){
            item.destroy({
                where: {
                    id: item.id 
                }
            }).then(x =>{
                res.status(200);
                res.send('');
            });
        }
        else{
            res.status(404);
            res.send('');
        }
    });
    
});

module.exports = router;