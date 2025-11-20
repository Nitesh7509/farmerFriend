const express = require("express");
const { createFeedback, getProductFeedback, likeFeedback, replyToFeedback } = require("../controllers/feedbackcontroller");
const { verifyToken } = require("../middlewares/auth");

const router = express.Router();

router.post("/create", verifyToken, createFeedback);
router.get("/product/:productId", getProductFeedback);
router.post("/like/:feedbackId", verifyToken, likeFeedback);
router.post("/reply/:feedbackId", verifyToken, replyToFeedback);

module.exports = router;
