/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    index : function(req, res) {
       Board.find({}).exec(function findCB(err,found){
         res.view({list: found});
     });
     
    },
    
    openBoard : function(req, res) {
    	
      var id = req.param("selectedId");
      console.log("selected id:"+id);
      Board.findOne(id).exec(function(err,found){
       console.log("edit board:found["+found+"]");
       console.dir(found);
    	  res.view({id:id, title :found["title"], description:found["description"]});
    	});
    },

    editBoard : function(req, res) {
    
      var id = req.param("selectedId");
      console.log("selected id:"+id);
      Board.findOne(id).exec(function(err,found){
       console.log("edit board:found["+found+"]");
       console.dir(found);
    	  res.view({id:id, title :found["title"], description:found["description"]});
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

