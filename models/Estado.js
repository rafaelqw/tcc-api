'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

	const Estado = sequelize.define('Estado', {
		cod_ibge: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		uf: {
			type: DataTypes.STRING,
			allowNull: true
		},
		nome: {
			type: DataTypes.STRING,
			allowNull: true
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
		tableName: 'tbl_estado'
	});

	Estado.getFullData = function() {
		console.log(this, sequelize);
	}

	return Estado;
};