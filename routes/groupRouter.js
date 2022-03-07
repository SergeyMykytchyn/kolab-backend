const Router = require("express");
const router = new Router();
const groupController = require("../controllers/groupController");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", checkRole(process.env.ROLE_ADMIN), groupController.create);
router.put("/", checkRole(process.env.ROLE_ADMIN), groupController.update);
router.get("/", authMiddleware, groupController.getAll);
router.get("/:groupId", authMiddleware, groupController.getOne);
router.delete("/:groupId", checkRole(process.env.ROLE_ADMIN), groupController.delete);
router.post("/add-with-identificator", authMiddleware, groupController.join);

module.exports = router;
