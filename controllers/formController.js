const { Form } = require("../models/models");

class FormController {
  async create(req, res, next) {
    try {
      const { user } = req;
      const { content, postId } = req.body;
      if (!content) {
        return next(ApiError.badRequest("All fileds must be filled"));
      }
      const form = await Form.create({ content, postId, userId: user.id });
      return res.json({ ...form.dataValues, user });
    } catch(err) {
      return next(ApiError.badRequest("Unexpected error"));
    }
  }
}

module.exports = new FormController();
