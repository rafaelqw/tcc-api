'use strict';
var moment = require('moment');

module.exports = (sequelize, DataTypes) => {

	const Municipio = sequelize.define('Municipio', {
		cod_ibge: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		cod_ibge_estado: {
			type: DataTypes.INTEGER,
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
		tableName: 'tbl_municipio'
	});

	Municipio.associate = function(models) {
		Municipio.hasMany(models.Cliente, {
			foreignKey: 'id_municipio'
		});
		Municipio.hasMany(models.Empreendimento, {
			foreignKey: 'id_municipio'
		});
	};
	

	Municipio.getFullData = function() {
		console.log(this, sequelize);
	}

	return Municipio;
};