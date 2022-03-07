const Router = require("express");
const router = new Router();
const postController = require("../controllers/postController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, postController.getAll);
router.post("/", checkRole(process.env.ROLE_ADMIN), postController.create);
router.get("/:id", authMiddleware, postController.getOne);

module.exports = router;
