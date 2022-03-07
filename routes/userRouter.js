const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);

module.exports = router;
