const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const groupRouter = require("./groupRouter");
const postRouter = require("./postRouter");
const formRouter = require("./formRouter");

router.use("/User", userRouter);
router.use("/Group", groupRouter);
router.use("/Post", postRouter);
router.use("/Form", formRouter);

module.exports = router;
