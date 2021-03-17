const findUserRouter = require("express").Router();
const findUserController = require("../controllers/findUser");

findUserRouter.get("/", findUserController.findUser);

module.exports = findUserRouter;