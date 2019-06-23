'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_empreendimento_porte', [{
      id: 1,
      porte: "Pequeno"
    },{
      id: 2,
      porte: "Medio"
    },{
      id: 3,
      porte: "Grande"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_empreendimento_porte', null, {});
  }
};
