const ApiError = require("../error/ApiError");
const { Post, Form, User } = require("../models/models");

class PostController {
  async getAll(req, res, next) {
    try {
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
          forms.push({ ...posts[i].forms[j].dataValues, user: { ...user.dataValues, password: null } });
        }
        postsResult.push({ ...posts[i].dataValues, forms });
      }
      return res.json(postsResult);
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async create(req, res, next) {
    try {
      const { caption, description, groupId } = req.body;
      if (!caption || !description) {
        return next(ApiError.badRequest("All fileds must be filled"));
      }
      const post = await Post.create({ caption, description, groupId });
      return res.json({ ...post.dataValues, forms: [] });
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async getOne(req, res, next) {
    try {
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
        forms.push({ ...post.forms[j].dataValues, user: { ...user.dataValues, password: null } });
      }
      const postsResult = { ...post.dataValues, forms };
      return res.json(postsResult);
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }
}

module.exports = new PostController();
