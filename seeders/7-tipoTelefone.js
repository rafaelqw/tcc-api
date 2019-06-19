'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_tipo_telefone', [{
      id: 1,
      descricao: "Telefone Fixo"
    },{
      id: 2,
      descricao: "Celular"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_tipo_telefone', null, {});
  }
};
