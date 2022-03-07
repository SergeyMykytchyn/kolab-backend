const { Group } = require("../models/models");

class GroupController {
  async create(req, res, next) {
    const { user } = req;
    const { name, description } = req.body;
    const group = await Group.create({ name, description, userId: user.id });
    return res.json(group);
  }

  async update(req, res, next) {
    const { id, name, description } = req.body;
    const group = await Group.update({ name, description }, { where: { id } });
    return res.json({ message: "Group was updated" });
  }

  async getAll(req, res, next) {
    
  }

  async getOne(req, res, next) {
    
  }

  async delete(req, res, next) {
    
  }

  async join(req, res, next) {
    
  }
}

module.exports = new GroupController();
