'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.;
    */

    return queryInterface.bulkInsert('tbl_dispositivo', [{
      id: 1,
      nome: "Sala de Estar",
      descricao: "Dispositivo instalado na sala de estar com 3 sensores de presença e 1 magnetico na porta",
      id_modelo: 1,
      id_empreendimento: 1
    },{
      id: 2,
      nome: "Quarto",
      descricao: "Dispositivo instalado no quarto com 1 sensor magnetico na porta",
      id_modelo: 2,
      id_empreendimento: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_dispositivo', null, {});
  }
};
