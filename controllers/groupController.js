const ApiError = require("../error/ApiError");
const { User, Group, Participant } = require("../models/models");
var validator = require("validator");

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
    const group = await Group.update({ name, description }, { where: { id, userId: user.id } });
    if (!group[0]) {
      return next(ApiError.internal("Group is not found"));
    }
    return res.json({ message: "Group was updated" });
  }

  async getAll(req, res, next) {
    const { user } = req;
    const groupsUser = await Group.findAll({ where: { userId: user.id } });
    const groupsUserResult = groupsUser.map(group => ({ ...group.dataValues, creator: user }));

    let groupsParticipant = await Participant.findAll({
      where: { userId: user.id },
      include: [{
        model: Group
      }]
    });
    groupsParticipant = groupsParticipant.map(group => (group.group));

    let groupsParticipantResult = [];
    const addCreators = async () => {
      for (let i = 0; i < groupsParticipant.length; i++) {
        const creator = await User.findOne({ where: { id: groupsParticipant[i].userId } });
        groupsParticipantResult.push({ ...groupsParticipant[i].dataValues, creator });
      }
    };

    await addCreators();
    return res.json([ ...groupsUserResult, ...groupsParticipantResult ].sort((a, b) => a.id - b.id));
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    const group = await Group.findOne({ where: { id } });
    const creator = await User.findOne({ where: { id: group.userId }});
    return res.json({ ...group.dataValues, creator });
  }

  async delete(req, res, next) {
    const { user } = req;
    const { id } = req.params;
    const group = await Group.destroy({ where: { id, userId: user.id } });
    if (!group) {
      return next(ApiError.internal("Group is not found"));
    }
    return res.json({ message: "Group was deleted" });
  }

  async join(req, res, next) {
    const { user } = req;
    const { identificator } = req.body;
    if (!validator.isUUID(identificator)) {
      return next(ApiError.internal("Invalid identificator"));
    }
    const group = await Group.findOne({ where: { identificator } });
    if (!group) {
      return next(ApiError.internal("The group with such identificator does not exists"));
    }
    const creator = await User.findOne({ where: { id: group.userId } });
    if (group.userId === user.id ) {
      return next(ApiError.internal("This user is a creator"));
    }
    const participant = await Participant.findOne({ where: { userId: user.id, groupId: group.id } });
    if (participant) {
      return next(ApiError.internal("You already participate this group"));
    }
    const newParticipant = await Participant.create({ userId: user.id, groupId: group.id });
    return res.json({ ...group.dataValues, creator });
  }
}

module.exports = new GroupController();
