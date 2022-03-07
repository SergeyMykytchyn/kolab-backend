const Router = require("express");
const router = new Router();
const formController = require("../controllers/formController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, formController.create);

module.exports = router;
