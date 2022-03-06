require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const router = require("./routes/index");

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server is up on port: ${PORT}`));
  } catch(err) {
    console.error(err.message);
  }
};

start();
