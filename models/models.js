const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM(["teacher", "student"]), allowNull: false }
});

const Group = sequelize.define("group", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  identificator: { type: DataTypes.STRING, allowNull: false }
});

User.hasMany(Group);
Group.belongsTo(User);

const Participant = sequelize.define('participant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

User.belongsToMany(Group, {through: Participant });
Group.belongsToMany(User, {through: Participant });

const Post = sequelize.define("post", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  caption: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING }
});

Group.hasMany(Post);
Post.belongsTo(Group);

const Form = sequelize.define("form", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  content: { type: DataTypes.STRING, allowNull: false }
});

User.hasMany(Form);
Form.belongsTo(User);

Post.hasMany(Form);
Form.belongsTo(Post);
