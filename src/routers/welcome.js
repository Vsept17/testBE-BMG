const welcomeRouter = require("express").Router();

welcomeRouter.get("/", (req, res) => {
    res.send("Welcome To The Jungle")
})

module.exports = welcomeRouter;