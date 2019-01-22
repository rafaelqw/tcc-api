'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Empreendimento = sequelize.define('Empreendimento', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descricao: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cnpj: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            endereco: {
                type: DataTypes.STRING,
                allowNull: true, 
            },
            numero: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bairro: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_estado: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_cidade: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_segmento: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_nivel: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            id_cliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE
            },
            deletedAt: {
                type: DataTypes.DATE
            },
            updatedAt:{
                type: DataTypes.DATE
            }
        }, {
          paranoid: true,
          tableName: 'tbl_empreendimento'
    });

    Empreendimento.getFullData = function() {
    console.log(this, sequelize);
    }

	return Empreendimento;
};

	