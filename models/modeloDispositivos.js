'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const ModeloDispositivos = sequelize.define('ModeloDispositivos', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            modelo:{
                type: DataTypes.STRING,
                allowNull: true,
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
          tableName: 'tbl_modelo_dispositivos'
    });

    ModeloDispositivos.getFullData = function() {
    console.log(this, sequelize);
    }

	return ModeloDispositivos;
};

	