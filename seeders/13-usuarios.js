'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_usuario', [{
      id: 1,
      nome: 'Lucas',
      email: "lucas@gmail.com"
    },{
      id: 2,
      nome: 'Rafael',
      email: "rafael@gmail.com"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_usuario', null, {});
  }
};
