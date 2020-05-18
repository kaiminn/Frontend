const dialect = "mysql";

module.exports = {
  development: {
    username: "root",
    password: "123456",
    database: "adminSystem_development",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect,
    autoMigrate: true
  },
  test: {
    username: "root",
    password: "123456",
    database: "adminSystem_test",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect,
    autoMigrate: true
  },
  production: {
    username: "root",
    password: null,
    database: "adminSystem_production",
    host: "mysql",
    // eslint-disable-next-line object-shorthand
    dialect: dialect
  }
};
