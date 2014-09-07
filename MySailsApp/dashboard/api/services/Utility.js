exports.getLoginInfo = function(req, res){
	var id = "";
	var nickname = "";
	if(req.session != null && req.session.passport != null){
	    id = req.session.passport.user || "";
	    nickname = req.session.passport.name || "";
	    role = req.session.passport.role || "";
	    console.dir(req.session.passport);
	}
	var roleDesc = "";
	if(role === 'admin') {
		roleDesc = "&nbsp;（管理者）";
	}
	return {userId: id, userName: nickname, roleName: role, roleDesc : roleDesc};
}