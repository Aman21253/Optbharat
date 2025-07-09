const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const reviewCtrl = require("../controllers/reviewController");
const otpCtrl = require("../controllers/otpController");
const userCtrl = require("../controllers/userController");

router.post("/register", userCtrl.registerUser);
router.post("/login", userCtrl.loginUser);
router.post("/suggest", userCtrl.suggestAlternative);
router.post("/bookmark", userCtrl.bookmarkBrand);
router.get("/:userId/bookmarks", userCtrl.getBookmarks);
router.post("/upvote", userCtrl.upvoteBrand);
router.post("/submit-review", reviewCtrl.submitReview);
router.post("/send-otp", otpCtrl.sendOtp);
router.post("/verify-otp", otpCtrl.verifyOtp);

module.exports = router;