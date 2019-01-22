'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Telefone = sequelize.define('Telefone', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            id_tipo: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ddd: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            numero_tel: {
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
        tableName: 'tbl_telefone'
    });

    Telefone.getFullData = function() {
    console.log(this, sequelize);
    }

    return Telefone;
};

