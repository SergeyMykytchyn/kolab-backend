const { Form } = require("../models/models");

class FormController {
  async create(req, res, next) {
    const { user } = req;
    const { content, postId } = req.body;
    const form = await Form.create({ content, postId, userId: user.id });
    return res.json({ ...form.dataValues, user });
  }
}

module.exports = new FormController();
