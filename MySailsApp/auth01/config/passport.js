var passport    = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

function createDummyUser(dummyUser, dummyPass) {
	User.findByUsername(dummyUser).exec(function(err, user) {
		if (err) {
			console.log(err);
		} else {
			console.log("User found:", user);
			if (user.length == 0) {
				console.log("create user...");
				User.create({
					username: dummyUser,
					password: dummyPass
				}).exec(function(err, user){
					if(err){
						console.log(err);
					} else{
						console.log("User created:", user);
					}
				});
			}
		}
	});
}

passport.serializeUser(function(user, done) {
  done(null, user[0].id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
	
// tnog temporary
	createDummyUser("user1", "password");

    User.findByUsername(username).exec(function(err, user) {
      if (err) { 
		return done(null, err);
	}
      if (!user || user.length < 1) {
 	return done(null, false, { message: 'Incorrect User'});
 }
      bcrypt.compare(password, user[0].password, function(err, res) {
        if (!res) {
		return done(null, false, { message: 'Invalid Password'});
	}
       return done(null, user);
      });
    });
  })
);

module.exports = {
 express: {
    customMiddleware: function(app){
      console.log('express midleware for passport');
      app.use(passport.initialize());
      app.use(passport.session());
    }
  }
};
