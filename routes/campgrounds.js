const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
var multer = require("multer");
const { storage } = require("../cloudinary");
var upload = multer({ storage });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.createNewCampground)
	);

router
	.route("/:id")
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.editCampground)
	)
	.get(catchAsync(campgrounds.showCampground));

router.get(
	"/:id/delete",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.deleteCampground)
);

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
