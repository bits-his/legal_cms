const db = require("../models");

const manage_client = (req, res) => {
  const {
    fileNo = null,
    name = null,
    email = null,
    phone = null,
    address = null,
    date = null,
  } = req.body;

  const { query_type = "create", client_id = null } = req.query;

  // Format date if provided
  let formattedDate = null;
  if (date) {
    if (typeof date === "object" && date.$d) {
      formattedDate = new Date(date.$d).toISOString().split("T")[0];
    } else {
      formattedDate = date;
    }
  }

  db.sequelize
    .query(
      `call client(:query_type,:client_id,:fileNo,:name,:email,:phone,:address,:date,@message)`,
      {
        replacements: {
          query_type,
          client_id,
          fileNo,
          name,
          email,
          phone,
          address,
          date: formattedDate,
        },
      }
    )
    .then((data) => {
      if (
        query_type === "CREATE" ||
        query_type === "UPDATE" ||
        query_type === "DELETE"
      ) {
        // For operations that return client_id and message
        res.json({ success: true, data: data[0] });
      } else {
        // For SELECT operations
        res.json({ success: true, data });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    });
};

const client_list = (req, res) => {
  const { client_id = null, fileNo = null } = req.query;
  const {
    query_type = "select",
    fileNo: bodyFileNo = null,
    name = null,
    email = null,
    phone = null,
    address = null,
    date = null,
  } = req.body;

  // Format date if provided
  let formattedDate = null;
  if (date) {
    if (typeof date === "object" && date.$d) {
      formattedDate = new Date(date.$d).toISOString().split("T")[0];
    } else {
      formattedDate = date;
    }
  }

  db.sequelize
    .query(
      `call client(:query_type,:client_id,:fileNo,:name,:email,:phone,:address,:date,@message)`,
      {
        replacements: {
          query_type,
          client_id,
          fileNo: fileNo || bodyFileNo,
          name,
          email,
          phone,
          address,
          date: formattedDate,
        },
      }
    )
    .then((data) => {
      if (query_type === "SELECT") {
        res.json({ success: true, data });
      } else {
        res.json({ success: true, data: data[0] });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, error: err.message });
    });
};

module.exports = { manage_client, client_list };
