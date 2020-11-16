const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const options = { toJSON: { virtuals: true } };
const CampGroundSchema = new Schema({
	title: String,
	price: Number,
	images: [
		{
			url: String,
			fileName: String,
		},
	],
	description: String,
	location: String,
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
}, options);

CampGroundSchema.virtual("properties.popupMarkup").get(function () {
	return `<a class="btn btn-dark btn-sm" href="/campgrounds/${this.id}"><strong>${this.title}</strong></a>`;
});

CampGroundSchema.post("findOneAndDelete", async function (doc) {
	console.log("Delete middleware...");
	await Review.deleteMany({ _id: { $in: doc.reviews } });
});

module.exports = mongoose.model("Campground", CampGroundSchema);
