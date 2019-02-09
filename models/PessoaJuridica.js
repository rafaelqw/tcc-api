'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const PessoaJuridica = sequelize.define('PessoaJuridica', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            nome_fantasia: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            razao_social: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cnpj: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            inscricao_estadual: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_cliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },createdAt: {
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
        tableName: 'tbl_pessoa_juridica'
    });

    PessoaJuridica.getFullData = function() {
    console.log(this, sequelize);
    }

    return PessoaJuridica;
};

