'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_pessoa_juridica', [{
      nome_fantasia: 'Cliente 2 juridico',
      razao_social: "teste",
      cnpj: "017230123",
      inscricao_estadual: "1990-08-23",
      id_cliente: 2
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_pessoa_juridica', null, {});
  }
};
