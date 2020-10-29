const config = require("../config.json");
const express = require("express");
const next = require("next");

const cors = require("cors");
const bodyParser = require("body-parser");

const Account = require("./api/routes/grubhub");

const dev = config.env !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = 4200;

app
  .prepare()
  .then(() => {
    const server = express();

    server.enable("view cache");
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(bodyParser.json());

    server.use("/api/account", Account);

    server.get("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(PORT, err => {
      if (err) throw err;
      console.log(`Ready on http://localhost:${PORT}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
