'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('tbl_cliente', [{
      id: 1,
      email: 'cliente1@teste.com',
      cep: "0000-000",
      logradouro: "Teste",
      numero: "123",
      bairro: "teste",
      complemento: "teste",
      id_estado: 35,
      id_municipio: 3550308
    },{
      id: 2,
      email: 'cliente2@teste.com',
      cep: "0000-000",
      logradouro: "Teste",
      numero: "123",
      bairro: "teste",
      complemento: "teste",
      id_estado: 35,
      id_municipio: 3550308
    }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkDelete('tbl_cliente', null, {});
  }
};
