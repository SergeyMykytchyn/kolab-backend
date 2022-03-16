const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const ApiError = require("../error/ApiError");
const { User, Group, Participant } = require("../models/models");
var validator = require("validator");

class GroupController {
  async create(req, res, next) {
    try {
      const { user } = req;
      const { name, description } = req.body;
      const img = req.files ? req.files.img : null;
      const fileName = img ? uuid.v4() + ".jpg" : null;
      if (img) {
        img.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const group = await Group.create({ name, description, userId: user.id, img: fileName });
      return res.json(group);
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async update(req, res, next) {
    try {
      const { user } = req;
      const { id, name, description } = req.body;
      const img = req.files ? req.files.img : null;
      
      const currentGroup = await Group.findOne({ where: { id } });
      const fileName = img ? uuid.v4() + ".jpg" : currentGroup.dataValues.img;
      if (img) {
        if (currentGroup.dataValues.img) {
          fs.stat(path.resolve(__dirname, "..", "static", currentGroup.dataValues.img), function(err, stat) {
            if(err == null) {
              fs.unlinkSync(path.resolve(__dirname, "..", "static", currentGroup.dataValues.img));
            }
          });
        }
        img.mv(path.resolve(__dirname, "..", "static", fileName));
      }

      const group = await Group.update({ name, description, img: fileName }, { where: { id, userId: user.id } });
      if (!group[0]) {
        return next(ApiError.internal("Group is not found"));
      }
      return res.json({ message: "Group was updated" });
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async getAll(req, res, next) {
    try {
      const { user } = req;
      const groupsUser = await Group.findAll({ where: { userId: user.id } });
      const currentUser = await User.findOne({ where: { id: user.id } });
      const groupsUserResult = groupsUser.map(group => ({ ...group.dataValues, creator: { ...currentUser.dataValues, password: null } }));

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
          groupsParticipantResult.push({ ...groupsParticipant[i].dataValues, creator: { ...creator.dataValues, password: null } });
        }
      };

      await addCreators();
      return res.json([ ...groupsUserResult, ...groupsParticipantResult ].sort((a, b) => a.id - b.id));
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const group = await Group.findOne({ where: { id } });
      const creator = await User.findOne({ where: { id: group.userId }});
      return res.json({ ...group.dataValues, creator: { ...creator.dataValues, password: null } });
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async delete(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.params;
      const group = await Group.destroy({ where: { id, userId: user.id } });
      if (!group) {
        return next(ApiError.internal("Group is not found"));
      }
      return res.json({ message: "Group was deleted" });
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }

  async join(req, res, next) {
    try {
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
        return next(ApiError.internal("You already participate this group"));
      }
      const participant = await Participant.findOne({ where: { userId: user.id, groupId: group.id } });
      if (participant) {
        return next(ApiError.internal("You already participate this group"));
      }
      const newParticipant = await Participant.create({ userId: user.id, groupId: group.id });
      return res.json({ ...group.dataValues, creator: { ...creator.dataValues, password: null } });
    } catch(err) {
      return next(ApiError.internal("Unexpected error"));
    }
  }
}

module.exports = new GroupController();
