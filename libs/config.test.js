module.exports = {
  database: "fuego_test",
  username: "",
  password: "",
  params: {
    dialect: "sqlite",
    storage: "fuego.sqlite",
    logging: false,
    define: {
      underscored: true
    }
  },
  jwtSecret: "FUEGO_TEST",
  jwtSession: {session: false}
};
