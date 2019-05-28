'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const UserEmpreendimento = sequelize.define('UserEmpreendimento', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            id_user: {
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
          tableName: 'tbl_user_empreendimento'
    });

    UserEmpreendimento.getFullData = function() {
    console.log(this, sequelize);
    }

	return UserEmpreendimento;
};

	