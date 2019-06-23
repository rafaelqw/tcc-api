'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('tbl_autenticacao', [{
      id: 1,
      id_usuario: 1,
      email: "lucas",
      senha: "$2a$10$8MTucddIRgLXGQOhkTLVNuK0buBZykt/noQw3qeaI8WQr8vyTbh4y"
    },{
      id: 2,
      id_usuario: 2,
      email: "rafael",
      senha: "$2a$10$8MTucddIRgLXGQOhkTLVNuK0buBZykt/noQw3qeaI8WQr8vyTbh4y"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_autenticacao', null, {});
  }
};
