module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "RoleRouters",
      [
        {
          path: "/100permission",
          roleId: 1,
        },
        {
          path: "103adjustRole",
          roleId: 1,
        },
        { path: "/adminAccount", roleId: 2 },
        { path: "adminaccount", roleId: 2 },
        { path: "/100permission", roleId: 2 },
        { path: "103adjustRole", roleId: 2 },
        { path: "/gamesetting", roleId: 2 },
        { path: "giveAway", roleId: 2 },
        { path: "gameRestrictions", roleId: 2 },
        { path: "gameRestrictionsSetting", roleId: 2 },
        { path: "gamePlayer", roleId: 2 },
        { path: "JPSetting", roleId: 2 },
        { path: "/200table", roleId: 2 },
        { path: "201cashRecord-table", roleId: 2 },
        { path: "202gameRecord-table", roleId: 2 },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("RoleRouters", null, {});
  },
};
