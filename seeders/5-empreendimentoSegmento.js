'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_empreendimento_segmento', [{
      id: 1,
      segmento: "Residencial"
    },{
      id: 2,
      segmento: "Comercial"
    },{
      id: 3,
      segmento: "Industrial"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_empreendimento_segmento', null, {});
  }
};
