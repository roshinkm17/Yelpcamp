const Review = require("../models/review");
const CampGround = require("../models/campground");

module.exports.createReview = async function (req, res) {
	const id = req.params.id;
	const campground = await CampGround.findById(id);
	const review = new Review(req.body);
	review.author = req.user._id;
	campground.reviews.push(review);
	await campground.save();
	await review.save();
	req.flash("success", "Review added successfully");
	res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async function (req, res) {
	const campId = req.params.id;
	const revId = req.params.revid;
	await CampGround.findByIdAndUpdate(campId, {
		$pull: { reviews: revId },
	});
	await Review.findByIdAndDelete(revId);
	req.flash("success", "Review deleted successfully");
	res.redirect(`/campgrounds/${campId}`);
};