const Campground = require("./models/campground");
const BaseJoi = require("joi");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");
const sanitizeHtml = require("sanitize-html")
const isLoggedIn = function (req, res, next) {
	if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
		req.flash("error", "You must log in");
		res.redirect("/login");
	} else {
		next();
	}
};
const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML",
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});
const Joi = BaseJoi.extend(extension);
const validateCampground = (req, res, next) => {
	const campgroundSchema = Joi.object({
		title: Joi.string().required().escapeHTML(),
		price: Joi.number().required().min(0),
		location: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML(),
		// image: Joi.string().required(),
		deleteImages: Joi.array()});
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(".");
		throw new ExpressError(message, 400);
		req.flash("error", "Validation error");
	} else {
		next();
	}
};
const isAuthor = async function (req, res, next) {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground.author.equals(req.user._id)) {
		req.flash("error", "Insufficient authorization");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};


const validateReview = function (req, res, next) {
	const reviewSchema = Joi.object({
		body: Joi.string().required().escapeHTML(),
		rating: Joi.number().required().min(1).max(5),
	}).required();
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(".");
		req.flash("error", "Validation error");
		throw new ExpressError(message, 400);
	} else {
		next();
	}
};

const isReviewAuthor = async function (req, res, next){
	const id = req.params.revId;
	const review = await Review.findById(id);
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "Insufficient authorization");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
}

module.exports = {isLoggedIn, validateCampground, isAuthor, validateReview, isReviewAuthor};

