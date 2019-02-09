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
            logradouro: {
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
            complemento: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_estado: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_municipio: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_segmento: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_porte: {
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

	