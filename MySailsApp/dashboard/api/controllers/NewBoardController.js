/**
 * NewBoardController
 *
 * @description :: Server-side logic for managing Newboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
    
    index : function(req, res) {
    
	var loginUserId = Utility.getLoginUserId(req, res);
	res.view({loginUserId: loginUserId});
    }
};

