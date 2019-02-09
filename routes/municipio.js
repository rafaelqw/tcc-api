var express = require('express');
var router = express.Router();
var models 	= require('../models');
var Sequelize = require('sequelize');
var underscore = require("underscore");
var moment = require('moment');
var schedule = require('node-schedule'); 
var Op = Sequelize.Op;
var Municipio = models.Municipio;

// Get Municipios
router.get('/', function(req, res, next) {
    Municipio.findAll().then(items => {
		if(items.length > 0) {
            res.json(items);
        }
        else {
            res.status(404);
            res.send('');
        }
	});
});

// Get Municipios
router.get('/:cod_ibge_estado', function(req, res, next) {
    Municipio.findAll({
    	where: {
    		cod_ibge_estado: req.params.cod_ibge_estado
    	}
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

module.exports = router;