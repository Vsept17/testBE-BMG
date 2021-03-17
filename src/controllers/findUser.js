const findUserModel = require("../models/findUser");
const form = require("../helpers/form");

module.exports = {
  findUser: (req, res) => {
    const { keyword } = req.query;
    findUserModel
      .findUser(keyword)
      .then((data) => {
        if (!data.length) {
          res.status(404).json({
            message: "User not found",
            status: 404,
          });
        } else {
          form.success(res, data);
        }
      })
      .catch((err) => {
        form.error(res, err);
      });
  },
};
