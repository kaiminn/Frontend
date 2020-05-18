const seed = require("../seeders/20200214015454-roles");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      "Roles",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        // parentId: {
        //   type: DataTypes.INTEGER,
        //   references: {
        //     model: "Roles",
        //     key: "id"
        //   }
        // },
        // hierarchyLevel: {
        //   type: DataTypes.INTEGER
        // },
        adminAccountId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "AdminAccount",
            key: "id",
          },
        },
        key: {
          type: DataTypes.STRING(36),
        },
        name: {
          allowNull: false,
          type: DataTypes.STRING,
        },
        description: {
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
    return queryInterface.dropTable("Roles");
  },
};
