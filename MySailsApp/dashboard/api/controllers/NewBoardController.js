/**
 * NewBoardController
 *
 * @description :: Server-side logic for managing Newboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    index : function(req, res) {
    
	var loginUserInfo = Utility.getLoginUserId(req, res);
	res.view({loginUserId: loginUserInfo["id"], loginUserName: loginUserInfo["name"]});
    }
};

