/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
	Board.find({}).exec(function(err,found){
            res.view({list: found});
	});
    },

    openBoard : function(req, res) {
	var boardId = req.param("selectedId");
	var userId = req.session.passport.user;
	console.log("selected boardId:"+boardId);
	Board.findOne(boardId).exec(function(err,found){
	    console.log("edit board:found["+found+"]");
	    Ticket.find({boardId : boardId}).exec(function(err, tickets) {
		for(var i = 0; i < tickets.length; i++) {
		    tickets[i]["nickname"] = "NICKNAME";
		}
		// var tickets3 = JSON.parse(JSON.stringify(tickets));
		// for(var i = 0; i < tickets3.length; i++) {
		//     var ti = tickets3[i];
		//     (function(num){
		// 	User.findOne(ti["createUser"]).exec(function(err, userFound) {
		// 	    if(userFound){
		// 		console.log("add to map:"+userFound["id"]+","+ userFound["nickname"]);
		// 		tickets3[num]["nickname"] = userFound["nickname"];
		// 		console.log("num="+num);
		// 	    }
		// 	});
		//     })(i);
		//     console.log("for end:"+i);
		// }
		// console.log("res.view");
    		res.view({boardId: boardId, 
		 	  userId: userId,
		 	  title : found["title"], 
		 	  description: found["description"],
		 	  list : tickets});
	    });
    	});
    },

    editBoard : function(req, res) {
	var id = req.param("selectedId");
	console.log("selected id:"+id);
	Board.findOne(id).exec(function(err,found){
	    console.log("edit board:found["+found+"]");
	    console.dir(found);
    	    res.view({ id: id, 
		       title :found["title"], 
		       description:found["description"]});
    	});
    },

    deleteBoard : function(req, res) {
	var id = req.param("selectedId");
	console.log("selected id:"+id);
	Board.destroy(id).exec(function(err,found){
            console.log("Destory board : "+id);
	});
    	res.redirect('/dashboard/index');
    },
    
    createBoard : function(req, res) {
    	res.redirect('/newboard/index');
    }

};

