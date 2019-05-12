'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Receiver = sequelize.define('Receiver', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            device_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            registration_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            id_usuario:{
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            flg_notificacao_ativa:{
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
          tableName: 'tbl_receiver'
    });

    Receiver.getFullData = function() {
    console.log(this, sequelize);
    }

	return Receiver;
};

	