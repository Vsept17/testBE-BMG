const authModel = require("../models/auth");
const form = require("../helpers/form");

module.exports = {
  register: (req, res) => {
    const { body } = req;
    authModel
      .postNewUser(body)
      .then(() => {
        form.success(res, {
          msg: "Register Berhasil",
          userData: {
            username: body.username,
            name: body.name,
            email: body.email,
            referral_code: body.referral_code,
          },
        });
      })
      .catch((err) => {
        form.error(res, err);
      });
  },

  login: (req, res) => {
    const { body } = req;
    authModel
      .postLogin(body)
      .then((data) => {
        form.success(res, data);
      })
      .catch((err) => {
        form.error(res, err);
      });
  },

  editProfile: (req, res) => {
    const { id } = req.params;
    const user_id = req.decodedToken.id;
    const { body } = req;
    const newResObj = {
      ...body,
    };
    authModel
      .editProfile(body, id, user_id)
      .then((data) => {
        if (data.affectedRows === 0) {
          res.status(404).json({
            message: "Data not found",
            status: 404,
          });
        } else {
          form.success(res, newResObj);
        }
      })
      .catch((err) => {
        form.error(res, err);
      });
  },
};
