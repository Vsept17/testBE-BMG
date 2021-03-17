require("dotenv").config();

const express = require("express");
const logger =require("morgan")
const cors = require('cors')
const mainRouter = require("./src/routers/index")

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

app.use(express.static("public"));
app.use(cors());
app.use(logger("dev"));

app.use(express.urlencoded({extended: false}));
app.use("/", mainRouter);

module.exports = app