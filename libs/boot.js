import https from "https";
import fs from "fs";

module.exports = app => {
  if (process.env.NODE_ENV !== "test") {
    const credentials = {
      key: fs.readFileSync("server.key", "utf8"),
      cert: fs.readFileSync("server.crt", "utf8")


    }
    app.db.sequelize.sync().done(() => {
      https.createServer(credentials, app)
        .listen(app.get("port"), () => {
          console.log(`Fuego API - Port ${app.get("port")}`);
        });
    });
  }
};
