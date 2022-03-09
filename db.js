const { Sequelize } = require("sequelize");

module.exports = new Sequelize(
  process.env.NODE_ENV === "production" ? process.env.DB_PRODUCTION_NAME : process.env.DB_NAME,
  process.env.NODE_ENV === "production" ? process.env.DB_PRODUCTION_USER : process.env.DB_USER,
  process.env.NODE_ENV === "production" ? process.env.DB_PRODUCTION_PASSWORD : process.env.DB_PASSWORD,
  {
    dialect: "postgres",
    host: process.env.NODE_ENV === "production" ? process.env.DB_PRODUCTION_HOST : process.env.DB_HOST,
    port: process.env.NODE_ENV === "production" ? process.env.DB_PRODUCTION_PORT : process.env.DB_PORT,
    dialectOptions: process.env.NODE_ENV === "production" ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : null
  }
);
