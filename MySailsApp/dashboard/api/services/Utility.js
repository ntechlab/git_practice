exports.getLoginUserId = function(req, res){
	var ret = "";
	if(req.session != null && req.session.passport != null){
	    ret = req.session.passport.user || "";
	}
	console.log("getLoginUserId -> "+ret);
	return ret;
}
