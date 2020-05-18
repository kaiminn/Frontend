const bcrypt = require("bcryptjs");
// import * as bcrypt from "bcryptjs";

module.exports = {
  up: async (queryInterface) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash("123456", saltRounds);

    return queryInterface.bulkInsert(
      "AdminAccount",
      [
        {
          account: "super",
          name: "超級管理者",
          prefix: "sp",
          isMaintained: false,
          passwordHash,
          hierarchyLevel: 1,
          createDatetime: new Date(),
        },
        {
          account: "admin",
          name: "管理者",
          prefix: "ad",
          isMaintained: false,
          passwordHash,
          parentId: 1,
          hierarchyLevel: 2,
          createDatetime: new Date(),
        },
        {
          account: "mabu777",
          name: "Mabu",
          prefix: "mabu",
          isMaintained: false,
          passwordHash,
          parentId: 1,
          hierarchyLevel: 2,
          createDatetime: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete("AdminAccount", null, {});
  },
};
