'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_tipo_sensor', [{
      id: 1,
      tipo_sensor: "Presença"
    },{
      id: 2,
      tipo_sensor: "Magnetico"
    },{
      id: 3,
      tipo_sensor: "Luz"
    },{
      id: 4,
      tipo_sensor: "Temperatura"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_tipo_sensor', null, {});
  }
};
