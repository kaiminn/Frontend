import { api, config } from "actionhero";
import { SequelizeInitializer } from "ah-sequelize-plugin/dist/initializers/sequelize";

import * as mysql from "mysql2/promise";

export class CreateDatabase extends SequelizeInitializer {
  constructor() {
    super();
    this.name = "createDatabase";
  }

  async start(): Promise<void> {
    await this.createDatabase();
    await super.start();
  }

  async createDatabase(): Promise<void> {
    const dbName = config.sequelize.database;
    const createDatabaseQueryString = `CREATE DATABASE IF NOT EXISTS ${config.sequelize.database};`;
    api.log(
      `mySQLConnection : mysql://${config.sequelize.username}:${config.sequelize.password}@${config.sequelize.host}:${config.sequelize.port}/${dbName}`
    );

    await mysql
      .createConnection({
        host: config.sequelize.host,
        port: config.sequelize.port,
        user: config.sequelize.username,
        password: config.sequelize.password,
      })
      .then((connection) => {
        connection.query(createDatabaseQueryString).then(() => {
          api.log("Database create or successfully checked");
        });
      });
  }
}
