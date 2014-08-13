/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works
 *              and what it represents here.
 * @docs :: http://sailsjs.org/#!documentation/models
 */
var crypto = require('crypto');

module.exports = {
	attributes : {
		username : {
			type : 'string',
			required : true,
			unique : true
		},
		password : {
			type : 'string',
			required : true
		},

		// Override toJSON method to remove password from API
		toJSON : function() {
			var obj = this.toObject();
			// Remove the password object value
			delete obj.password;
			// return the new object without password
			return obj;
		}
	},

	beforeCreate : function(user, cb) {
		var shasum = crypto.createHash('sha1');
		shasum.update(user.password);
		var hashed = shasum.digest('hex');
	 	user.password = hashed;
		cb(null, user);
	}
};
