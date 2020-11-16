const CampGround = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
	const campgrounds = await CampGround.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.editCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await CampGround.findByIdAndUpdate(id, req.body);
	const imgs = req.files.map((f) => ({
		url: f.path,
		fileName: f.filename,
	}));
	campground.images.push(...imgs);
	if (req.body.deleteImages) {
		for (let filename of req.body.deleteImages) {
			await cloudinary.uploader.destroy(filename);
		}
		await campground.updateOne({
			$pull: { images: { fileName: { $in: req.body.deleteImages } } },
		});
		console.log(campground);
	}
	await campground.save();
	req.flash("success", "Campground updated successfully");
	res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await CampGround.findByIdAndDelete(id);
	req.flash("success", "Campground deleted successfully");
	res.redirect("/campgrounds");
};

module.exports.createNewCampground = async (req, res, next) => {
	const location = await geocoder
		.forwardGeocode({
			query: req.body.location,
			limit: 1,
		})
		.send();
	// res.send(location.body.features[0].geometry.coordinates);
	const campground = new CampGround(req.body);
	campground.geometry = location.body.features[0].geometry;
	campground.images = req.files.map((f) => ({
		url: f.path,
		fileName: f.filename,
	}));
	campground.author = req.user._id;
	const newCamp = await campground.save();
	console.log(campground);
	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${newCamp._id}`);

};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await CampGround.findById(id);
	res.render("campgrounds/edit", { campground });
};

module.exports.showCampground = async (req, res) => {
	const { id } = req.params;
	const campground = await CampGround.findById(id)
		.populate({
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author");
	res.render("campgrounds/show", { campground });
};
