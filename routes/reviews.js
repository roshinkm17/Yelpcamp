const express = require("express");
const reviews = require("../controllers/reviews");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware")

router.post(
	"/",
	isLoggedIn,
	validateReview,
	catchAsync(reviews.createReview)
);

router.delete(
	"/:revid",
	isLoggedIn,
	isReviewAuthor,
	catchAsync(reviews.deleteReview)
);

module.exports = router;