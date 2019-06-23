'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_telefone', [{
      id_tipo: 1,
      ddd: "11",
      numero_tel: "88263796123",
      id_cliente: 1
    },{
      id_tipo: 2,
      ddd: "12",
      numero_tel: "59163231225",
      id_cliente: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_telefone', null, {});
  }
};
