const User = require("../models/user")

module.exports.renderRegisterForm = function (req, res) {
	res.render("users/register");
};

module.exports.registerUser = async (req, res) => {
	try {
		const { email, username, password } = req.body;
		const user = new User({ email, username });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (err) => {
			if (err) {
				next(err);
			} else {
				req.flash("success", "Welcome to YelpCamp!");
				const redirectUrl = req.session.returnTo || "/campgrounds";
				delete req.session.returnTo;
				res.redirect(redirectUrl);
			}
		});
	} catch (e) {
		req.flash("error", "A user with this username already exists");
		res.redirect("/register");
	}
};

module.exports.renderLoginForm = function (req, res) {
	res.render("users/login");
};

module.exports.loginUser = function (req, res) {
	req.flash("success", "Welcome back!");
	const redirectUrl = req.session.returnTo || "/campgrounds";
	delete req.session.returnTo;
	res.redirect(redirectUrl);
};

module.exports.logoutUser = async (req, res) => {
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/login");
};