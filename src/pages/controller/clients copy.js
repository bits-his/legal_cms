const { manage_client, client_list } = require("../controllers/clients");
  module.exports = (app) => {
    app.post("/clients", manage_client);
    app.get("/clients", client_list);
  };
  