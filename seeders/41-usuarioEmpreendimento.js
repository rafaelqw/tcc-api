'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('tbl_usuario_empreendimento', [{
      id: 1,
      id_usuario: 1,
      id_empreendimento: 1
    },{
      id: 2,
      id_usuario: 1,
      id_empreendimento: 2
    },{
      id: 3,
      id_usuario: 2,
      id_empreendimento: 2
    },{
      id: 4,
      id_usuario: 2,
      id_empreendimento: 2
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_usuario_empreendimento', null, {});
  }
};
