'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Cliente = sequelize.define('Cliente', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: true
            },
            cep: {
                type: DataTypes.STRING,
                allowNull: true
            },
            endereco: {
                type: DataTypes.STRING,
                allowNull: true
            },
            numero: {
                type: DataTypes.STRING,
                allowNull: true
            },
            bairro: {
                type: DataTypes.STRING,
                allowNull: true
            },
            complemento: {
                type: DataTypes.STRING,
                allowNull: true
            },
            id_cidade: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            id_estado: {
                type: DataTypes.INTEGER,
                allowNull: true
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
        tableName: 'tbl_cliente'
    });

    Cliente.associate = function(models) {
        Cliente.hasMany(models.PessoaFisica, {
          foreignKey: 'id_cliente'
        });
        Cliente.hasMany(models.PessoaJuridica, {
            foreignKey: 'id_cliente'
          });
      };
    

    Cliente.getFullData = function() {
    console.log(this, sequelize);
    }

    return Cliente;
};

