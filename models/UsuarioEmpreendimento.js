'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const UsuarioEmpreendimento = sequelize.define('UsuarioEmpreendimento', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            id_usuario: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
            },
            id_empreendimento: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notEmpty: true
                }
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
          tableName: 'tbl_usuario_empreendimento'
    });

    UsuarioEmpreendimento.getFullData = function() {
    console.log(this, sequelize);
    }

	return UsuarioEmpreendimento;
};

	