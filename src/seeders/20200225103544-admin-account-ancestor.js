module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "AdminAccountsancestors",
      [
        {
          adminAccountId: 2,
          ancestorId: 1,
        },
        {
          adminAccountId: 3,
          ancestorId: 1,
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("AdminAccountsancestors", null, {});
  },
};
