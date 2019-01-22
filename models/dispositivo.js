'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Dispositivo = sequelize.define('Dispositivo', {
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
            descricao:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_modelo:{
                type: DataTypes.INTEGER,
                allowNull: true, 
            },
            id_empreendimento:{
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
          tableName: 'tbl_dispositivo'
    });

    Dispositivo.getFullData = function() {
    console.log(this, sequelize);
    }

	return Dispositivo;
};

	