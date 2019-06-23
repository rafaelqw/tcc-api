'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
   return queryInterface.bulkInsert('tbl_sensor', [{
      id: 1,
      nome: "Sensor de Presença 1",
      descricao: "Teste 1",
      id_tipo_sensor: 1,
      localizacao: "Canto direito",
      id_dispositivo: 1
    },{
      id: 2,
      nome: "Sensor de Presença 2",
      descricao: "Teste 2",
      id_tipo_sensor: 1,
      localizacao: "Canto esquerdo",
      id_dispositivo: 1
    },{
      id: 3,
      nome: "Sensor de Presença 3",
      descricao: "Teste 3",
      id_tipo_sensor: 1,
      localizacao: "Canto superior esquerdo",
      id_dispositivo: 1
    },{
      id: 4,
      nome: "Sensor de Magnetico 1",
      descricao: "Teste 1",
      id_tipo_sensor: 2,
      localizacao: "Canto esquerdo",
      id_dispositivo: 1
    },{
      id: 5,
      nome: "Sensor de Magnetico 2",
      descricao: "Teste 2",
      id_tipo_sensor: 2,
      localizacao: "Porta",
      id_dispositivo: 2
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tbl_sensor', null, {});
  }
};
