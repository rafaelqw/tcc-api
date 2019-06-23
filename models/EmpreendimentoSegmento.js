'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const EmpreendimentoSegmento = sequelize.define('EmpreendimentoSegmento', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            segmento: {
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
          tableName: 'tbl_empreendimento_segmento'
    });


    EmpreendimentoSegmento.getFullData = function() {
    console.log(this, sequelize);
    }

	return EmpreendimentoSegmento;
};

	