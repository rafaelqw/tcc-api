'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('tbl_empreendimento', [{
        id: 1,
        nome: 'Empreendimento Teste',
        descricao: "Apenas para Testes",
        cnpj: "012030120301203",
        cep: "0000-000",
        logradouro: "Teste",
        numero: "123",
        bairro: "teste",
        complemento: "teste",
        id_estado: 35,
        id_municipio: 3550308,
        id_segmento: 1,
        id_porte: 1,
        id_cliente: 1
      }], {});
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_empreendimento', null, {});
  }
};
