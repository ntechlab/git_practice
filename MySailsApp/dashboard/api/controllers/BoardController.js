/**
 * BoardController
 *
 * @description :: Server-side logic for managing Boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	res.view();
    },
    
    createBoard : function(req, res) {
	console.log("create board");
	Board.create({
	    title:req.param('title'), 
	    description : req.param('description')
	}).exec(function(err,created){
	    res.redirect("/dashboard/index");
	});
    },
    
    updateBoard : function(req, res) {
	console.log("update board:"+req.param('id'));
	Board.update(req.param('id'), {
	    title:req.param('title'), 
	    description : req.param('description')
	}).exec(function(err,created){
	    res.redirect("/dashboard/index");
	});
    }

};

