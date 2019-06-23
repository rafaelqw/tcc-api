'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

    const Usuario = sequelize.define('Usuario', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            nome: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
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
          tableName: 'tbl_usuario'
    });

    Usuario.getFullData = function() {
    console.log(this, sequelize);
    }

	return Usuario;
};

	