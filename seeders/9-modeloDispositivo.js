'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_modelo_dispositivos', [{
      id: 1,
      modelo: "Arduino Uno"
    },{
      id: 2,
      modelo: "Arduino Mega"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_modelo_dispositivos', null, {});
  }
};
