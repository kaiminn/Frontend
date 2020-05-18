module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "AdminAccountRoles",
      [
        {
          adminAccountId: 1,
          roleId: 1,
        },
        {
          adminAccountId: 2,
          roleId: 2,
        },
        {
          adminAccountId: 3,
          roleId: 2,
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("AdminAccountRoles", null, {});
  },
};
