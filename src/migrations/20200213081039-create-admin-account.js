const seed = require("../seeders/20200214015453-adminAccount");

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable(
      "AdminAccount",
      {
        id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.INTEGER,
          references: {
            model: "AdminAccount",
            key: "id",
          },
        },
        hierarchyLevel: {
          type: DataTypes.INTEGER,
        },
        account: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
        },

        prefix: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },

        isMaintained: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        passwordHash: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        lastLoginIP: {
          type: DataTypes.STRING,
        },

        isEnabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },

        lastLoginDatetime: {
          type: DataTypes.DATE,
        },

        createDatetime: {
          type: DataTypes.DATE,
        },
      },
      {
        charset: "utf8mb4",
      }
    );

    await seed.up(queryInterface);
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable("AdminAccount");
  },
};
