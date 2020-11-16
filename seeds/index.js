const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const CampGround = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
mongoose
	.connect("mongodb://localhost:27017/yelp-camp", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("database conneciton open...");
	})
	.catch((err) => {
		console.log("Error occured...", err);
	});

const getRandom = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
	await CampGround.deleteMany();
	for (let i = 0; i < 200; i++) {
		const random = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new CampGround({
			location: `${cities[random].city}, ${cities[random].state}`,
			geometry: { type: "Point", coordinates: [cities[random].longitude, cities[random].latitude] },
			title: `${getRandom(descriptors)} ${getRandom(places)}`,
			images: [
				{
					url:
						"https://res.cloudinary.com/dxedmkzss/image/upload/v1605418411/YelpCamp/m20elcpgvjs6ogszcgfe.jpg",
					fileName: "YelpCamp/m20elcpgvjs6ogszcgfe",
				},
				{
					url:
						"https://res.cloudinary.com/dxedmkzss/image/upload/v1605418416/YelpCamp/dhgjw4el8a0k0jgjzy65.jpg",
					fileName: "YelpCamp/dhgjw4el8a0k0jgjzy65",
				},
			],
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, obcaecati.",
			price: price,
			author: "5facc5c5c76d1d0bb0cf5648",
		});
		await camp.save();
	}
};

seedDB().then(() => {
	console.log("database connection closed...");
	mongoose.connection.close();
});
