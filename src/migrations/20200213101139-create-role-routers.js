const seed = require("../seeders/20200215073822-roleRouters.js");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      "RoleRouters",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        roleId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          references: {
            model: "Roles",
            key: "id",
          },
        },
        path: {
          allowNull: false,
          type: DataTypes.STRING,
        },
      },
      {
        charset: "utf8mb4",
      }
    );

    await seed.up(queryInterface);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("RoleRouters");
  },
};
