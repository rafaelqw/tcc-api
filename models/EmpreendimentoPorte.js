'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const EmpreendimentoPorte = sequelize.define('EmpreendimentoPorte', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            porte: {
                type: DataTypes.STRING,
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
          tableName: 'tbl_empreendimento_porte'
    });


    EmpreendimentoPorte.getFullData = function() {
    console.log(this, sequelize);
    }

	return EmpreendimentoPorte;
};

	