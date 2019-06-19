'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */

   return queryInterface.bulkInsert('tbl_pessoa_fisica', [{
      nome: 'Cliente 1 fisico',
      cpf: "123091723078",
      rg: "017230123",
      data_nascimento: "1990-08-23",
      id_cliente: 1,
      sexo: "Masculino"
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_pessoa_fisica', null, {});
  }
};
