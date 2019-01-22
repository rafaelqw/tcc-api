'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const TipoTelefone = sequelize.define('TipoTelefone', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            descricao: {
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
        tableName: 'tbl_tipoTelefone'
    });

    TipoTelefone.getFullData = function() {
    console.log(this, sequelize);
    }

    return TipoTelefone;
};

