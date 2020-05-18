const uuid = require("uuid/v4");

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "Roles",
      [
        {
          adminAccountId: 1,
          key: "5478c9d5-1078-4607-9624-4a6dbcae92e7",
          name: "Super",
          // hierarchyLevel: 1,
          description: "Super Role",
        },
        {
          adminAccountId: 1,
          // parentId: 1,
          // hierarchyLevel: 2,
          key: uuid(),
          name: "Admin",
          description: "Admin Role",
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("Roles", null, {});
  },
};
