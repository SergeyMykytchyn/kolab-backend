const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const ApiError = require("../error/ApiError");
const { User, Participant } = require("../models/models");

const generateJwt = (id, firstName, lastName, email, role) => {
  return jwt.sign(
    { id, firstName, lastName, email, role },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

class UserController {
  async signUp(req, res, next) {
    const { firstName, lastName, email, password, passwordConfirm, role } = req.body;
    if (!firstName || !lastName || !email || !password || !role) {
      return next(ApiError.badRequest("All fileds must be filled"));
    }
    if (password !== passwordConfirm) {
      return next(ApiError.badRequest("Passwords does not match"));
    }
    if (role !== "teacher" && role !== "student") {
      return next(ApiError.badRequest("The role is incorrect"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("The user with exact email is already exists"));
    }
    const hashPassword = await bcrypt.hash(password, 6);
    const user = await User.create({ firstName, lastName, email, role, password: hashPassword });
    const token = generateJwt(user.id, user.firstName, user.lastName, user.email, user.role);
    return res.json({ token });
  }

  async signIn(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("The user is not found"));
    }
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("The password is incorrect"));
    }
    const token = generateJwt(user.id, user.firstName, user.lastName, user.email, user.role);
    return res.json({ token });
  }

  async userInfo(req, res, next) {
    const { user } = req;
    const currentUser = await User.findOne({ where: { id: user.id }});
    return res.json({ ...currentUser.dataValues, password: null });
  }

  async leaveGroup(req, res, next) {
    const { user } = req;
    const { groupId } = req.query;
    const participant = await Participant.destroy({ where: { userId: user.id, groupId } });
    return res.json({ message: "Ok" });
  }

  async update(req, res, next) {
    const { user } = req;
    let { firstName, lastName, email, password } = req.body;
    const img = req.files ? req.files.img : null;
    if (!firstName || !lastName || !email) {
      return next(ApiError.badRequest("Fields: First name, Last name and Email must be filled"));
    }

    const candidate = await User.findOne({ where: { email } });
    if (email !== user.email && candidate) {
      return next(ApiError.badRequest("The user with exact email is already exists"));
    }

    const currentUser = await User.findOne({ where: { id: user.id }});
    const fileName = img ? uuid.v4() + ".jpg" : currentUser.dataValues.img;
    if (img) {
      if (currentUser.dataValues.img) {
        fs.stat(path.resolve(__dirname, "..", "static", currentUser.dataValues.img), function(err, stat) {
          if(err == null) {
            fs.unlinkSync(path.resolve(__dirname, "..", "static", currentUser.dataValues.img));
          }
        });
      }
      img.mv(path.resolve(__dirname, "..", "static", fileName));
    }
    if (!password) {
      const updatedUser = await User.update({ firstName, lastName, email, img: fileName }, { where: { id: user.id } });
    } else {
      const hashPassword = await bcrypt.hash(password, 6);
      const updatedUser = await User.update({ firstName, lastName, email, password: hashPassword, img: fileName }, { where: { id: user.id } });
    }
    const resultedUser = await User.findOne({ where: { id: user.id }});
    return res.json({ ...resultedUser.dataValues, password: null });
  }
}

module.exports = new UserController();
