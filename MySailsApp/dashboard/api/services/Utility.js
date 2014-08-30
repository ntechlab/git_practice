exports.getLoginUserId = function(req, res){
	var id = "";
	var nickname = "";
	if(req.session != null && req.session.passport != null){
	    id = req.session.passport.user || "";
	    nickname = req.session.passport.name || "";
	    console.dir(req.session.passport);
	}
	return {id: id, name: nickname};
}
