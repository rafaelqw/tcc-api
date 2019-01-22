'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const RegistroSensor = sequelize.define('RegistroSensor', {
            id_sensor: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            valor:{
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
          tableName: 'tbl_registro_sensor'
    });

    RegistroSensor.getFullData = function() {
    console.log(this, sequelize);
    }

	return RegistroSensor;
};

	