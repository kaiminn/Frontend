import { join } from "path";
// TODO: 追原因
const cfg = require("../../sequelize.js");

const nodeEnv =
  process.env.NODE_ENV === undefined ? "development" : process.env.NODE_ENV;

export const DEFAULT = {
  sequelize: () => {
    const database =
      process.env.MYSQL_DATABASE ||
      cfg[nodeEnv].database ||
      "adminSystem_development";
    const host = process.env.MYSQL_HOST || cfg[nodeEnv].host || "127.0.0.1";
    const port = process.env.MYSQL_PORT || cfg[nodeEnv].port || 3306;
    const username = process.env.MYSQL_USER || cfg[nodeEnv].username || "root";
    const password =
      process.env.MYSQL_PASSWORD || cfg[nodeEnv].password || "123456";
    const autoMigrate =
      cfg[nodeEnv].autoMigrate !== undefined ? cfg[nodeEnv].autoMigrate : true;
    const dialect = "mysql";

    return {
      autoMigrate,
      loadFixtures: false,
      database,
      logging: false,
      dialect,
      host,
      port,
      username,
      password,
      models: [join(__dirname, "..", "models")],
      migrations: [join(__dirname, "..", "migrations")],
      timezone: "+08:00",
      define: {
        timestamps: false, // 禁用所有的時間戳記
      },
    };
  },
};
