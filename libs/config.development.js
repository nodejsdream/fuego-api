import logger from "./logger.js";

module.exports = {
  database: "fuego",
  username: "",
  password: "",
  params: {
    dialect: "sqlite",
    storage: "fuego.sqlite",
    logging: (sql) => {
      logger.info(`[${new Date()}] ${sql}`);
    },
    define: {
      underscored: true
    }
  },
  jwtSecret: "Fue$0-AP1",
  jwtSession: {session: false}
};
