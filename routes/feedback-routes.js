const express = require("express");
const router = express.Router();

const feedbackController = require("../controllers/feedback-controllers");

router.get("/check/:userid", feedbackController.fetchFeedback);

router.post("/upload", feedbackController.postFeedback);

router.get("/fetch-data/:filename", feedbackController.fetchFeedBackData);

router.post("/mark-as-read/:filename", feedbackController.markFileAsRead);

module.exports = router;
