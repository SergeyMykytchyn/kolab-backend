const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/models");

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
      return next(ApiError.badRequest("Incorrect data"));
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
    return res.json(user);
  }
}

module.exports = new UserController();
