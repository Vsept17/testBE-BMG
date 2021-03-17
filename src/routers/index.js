const express = require("express");

const mainRouter = express.Router();

const welcomeRouter = require("./welcome")

const authRouter = require("./auth");
const findUserRouter = require("./findUser");

mainRouter.use("/", welcomeRouter);

mainRouter.use("/auth", authRouter);

mainRouter.use("/finduser", findUserRouter);
module.exports = mainRouter;