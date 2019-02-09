'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const PessoaFisica = sequelize.define('PessoaFisica', {
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
            cpf: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            rg: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            data_nascimento: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            id_cliente: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sexo: {
                type: DataTypes.STRING,
                allowNull: true,
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
        tableName: 'tbl_pessoa_fisica'
    });

    PessoaFisica.associate = function(models) {
        PessoaFisica.belongsTo(models.Cliente, {
            onDelete: "CASCADE",
            foreignKey: 'id'
        });
    };

    PessoaFisica.getFullData = function() {
    console.log(this, sequelize);
    }

    return PessoaFisica;
};

