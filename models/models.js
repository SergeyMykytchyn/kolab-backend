const sequelize = require("../db");
const { Sequelize, DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM(["teacher", "student"]), allowNull: false },
  img: { type: DataTypes.STRING }
});

const Group = sequelize.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  identificator: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, unique: true },
  img: { type: DataTypes.STRING }
});

User.hasMany(Group);
Group.belongsTo(User);

const Participant = sequelize.define('participant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

User.hasMany(Participant);
Participant.belongsTo(User);

Group.hasMany(Participant);
Participant.belongsTo(Group);

const Post = sequelize.define("post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  caption: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT }
});

Group.hasMany(Post);
Post.belongsTo(Group);

const Form = sequelize.define("form", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.TEXT, allowNull: false }
});

User.hasMany(Form);
Form.belongsTo(User);

Post.hasMany(Form);
Form.belongsTo(Post);

module.exports = {
  User,
  Group,
  Participant,
  Post,
  Form
};
