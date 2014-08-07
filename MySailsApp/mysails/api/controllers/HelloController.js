/**
 * HelloController
 *
 * @description :: Server-side logic for managing helloes
 * @help :: See http://links.sailsjs.org/docs/controllers
 */
var found;

module.exports = {

	/**
	 * `HelloController.index()`
	 */
	index : function(req, res) {

		User.find().exec(function(err, users) {

			if (err) {
				return console.log(err);
			} else {
				found = users;
				console.log("Users found:", users);
			}

		});

		return res.view({
			users : found
		});
	}
};
