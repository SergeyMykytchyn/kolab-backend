const { Post, Form, User } = require("../models/models");

class PostController {
  async getAll(req, res, next) {
    const { groupId } = req.query;
    let posts = await Post.findAll({
      where: { groupId },
      include: [{
        model: Form
      }]
    });
    let postsResult = [];
    for (let i = 0; i < posts.length; i++) {
      let forms = [];
      for (let j = 0; j < posts[i].forms.length; j++) {
        const user = await User.findOne({ where: { id: posts[i].forms[j].dataValues.userId } });
        forms.push({ ...posts[i].forms[j].dataValues, user });
      }
      postsResult.push({ ...posts[i].dataValues, forms });
    }
    return res.json(postsResult);
  }

  async create(req, res, next) {
    const { caption, description, groupId } = req.body;
    const post = await Post.create({ caption, description, groupId });
    return res.json({ ...post.dataValues, forms: [] });
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    const post = await Post.findOne({
      where: { id },
      include: [{
        model: Form
      }]
    });
    let forms = [];
    for (let j = 0; j < post.forms.length; j++) {
      const user = await User.findOne({ where: { id: post.forms[j].dataValues.userId } });
      forms.push({ ...post.forms[j].dataValues, user });
    }
    const postsResult = { ...post.dataValues, forms };
    return res.json(postsResult);
  }
}

module.exports = new PostController();
