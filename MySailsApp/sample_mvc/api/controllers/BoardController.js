/**
 * BoardController
 *
 * @description :: Server-side logic for managing boards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `BoardController.index()`
   */
  index: function (req, res) {

  Ticket.find().exec(function(err, user) {
    var ret = "";
    for(var i = 0; i < user.length;i++){
      console.log(i+":"+user[i]);
      ret += user[i].contents;
      ret += "<br>";
    }  
    var param = {list : user};
    res.view(param);
    });
  },

  ticketCreate: function (req, res) {
    console.log("ticketCreate");
      Ticket.create({
        contents: req.param('memo')
      }).exec(function(err, user) {
      if (err) {
          return console.log(err);
      } else {
        console.log("User created:", user);
        res.redirect("board/index");
    }
    });
  },

  ticketDelete: function (req, res) {
    console.log("destroy[" + req.param('id') + "]");

    Ticket.find({id : req.param('id')}).exec(function(err, user){
    console.dir(user);
    user[0].destroy();
      res.redirect("board/index");
  });
  }
  ,

};

