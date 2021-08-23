const express = require("express");
const imageController = require("../controllers/imageController");

const router = express.Router();

router.post("/upload", imageController.uploadSection);
router.get("/get/:type", imageController.getRandomSection);
router.get("/get/section/:id", imageController.getSection);
router.post("/get/recentUploads", imageController.getRecentUploads);
router.post("/get/usersections", imageController.getUserImages);
router.post("/get/combineSections", imageController.combineUserImages);

module.exports = router;
