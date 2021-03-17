const authRouter = require("express").Router();
const authControllers =require("../controllers/auth");

const checkToken = require("../helpers/middleware/checkToken");

authRouter.post("/register", authControllers.register);
authRouter.post("/login", authControllers.login);
authRouter.patch("/editprofile/:id", checkToken, authControllers.editProfile);


module.exports = authRouter;