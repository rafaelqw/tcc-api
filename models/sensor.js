'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Sensor = sequelize.define('Sensor', {
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
            id_tipo_sensor:{
                type: DataTypes.INTEGER,
                allowNull: false, 
            },
            localizacao:{
                type: DataTypes.STRING,
                allowNull: true,
            },
            id_dispositivo:{
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
          tableName: 'tbl_sensor'
    });

    Sensor.getFullData = function() {
    console.log(this, sequelize);
    }

	return Sensor;
};

	