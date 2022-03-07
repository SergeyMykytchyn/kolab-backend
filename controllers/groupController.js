const { Group } = require("../models/models");

class GroupController {
  async create(req, res, next) {
    const { user } = req;
    const { name, description } = req.body;
    const group = await Group.create({ name, description, userId: user.id });
    return res.json(group);
  }

  async update(req, res, next) {
    const { user } = req;
    const { id, name, description } = req.body;
    const updatedGroup = await Group.update({ name, description }, { where: { id, userId: user.id } });
    if (!updatedGroup[0].length) {
      return res.json({ message: "Group is not found" });
    }
    return res.json({ message: "Group was updated" });
  }

  async getAll(req, res, next) {
    const { user } = req;
    const { userId } = req.query;
    const groups = await Group.findAll({ where: { userId, userId: user.id } });
    return res.json(groups.map(group => ({ ...group.dataValues, creator: user })));
  }

  async getOne(req, res, next) {
    const { user } = req;
    const { id } = req.params;
    const group = await Group.findOne({ where: { id, userId: user.id } });
    return res.json(group);
  }

  async delete(req, res, next) {
    
  }

  async join(req, res, next) {
    
  }
}

module.exports = new GroupController();
