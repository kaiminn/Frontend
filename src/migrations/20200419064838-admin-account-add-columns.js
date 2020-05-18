const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("AdminAccount", "website", {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "",
      }),
      queryInterface.addColumn("AdminAccount", "hashKey", {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "",
      }),
      queryInterface.addColumn("AdminAccount", "APIDomain", {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "",
      }),
      queryInterface.addColumn("AdminAccount", "whiteIPList", {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: "",
      }),
    ]).then(() => {
      queryInterface.sequelize.query("UPDATE `AdminAccount` SET hashKey=''");
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("AdminAccount", "website"),
      queryInterface.removeColumn("AdminAccount", "hashKey"),
      queryInterface.removeColumn("AdminAccount", "APIDomain"),
      queryInterface.removeColumn("AdminAccount", "whiteIPList"),
    ]);
  },
};
