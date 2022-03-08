const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);
router.get("/user-info", authMiddleware, userController.userInfo);
router.post("/leave-group", authMiddleware, userController.leaveGroup);
router.put("/update", authMiddleware, userController.update);

module.exports = router;
