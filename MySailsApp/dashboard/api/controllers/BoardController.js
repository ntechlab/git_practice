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
    },
  
  register : function(req, res) {
    console.log("リスナ登録");
    
    // publishCreate用のリスナ登録
    Room.watch(req.socket);
    
    // publishUpdate, publishDestroy用のリスナ登録
    if(req.isSocket){
      Ticket.find({}).exec(function(e, listOfTickets){
        Room.subscribe(req.socket, listOfTickets);
      });
    }
  },
  
  // チケットの作成、削除、更新処理アクション
  process : function(req, res) {
    var actionType = req.param('actionType');
    var id = req.param('id');
    console.log("チケット処理：id=" + id + ",actionType=" + actionType);
    if (actionType == "create") {
      console.log("チケット作成");
	var userId = req.param('userId');
	User.findOne(userId).exec(function(err, foundUser) {
	    Ticket.create({
		boardId : req.param('boardId'),
		createUser : userId,
		contents : req.param('contents'),
		positionX : req.param('positionX'),
		positionY : req.param('positionY'),
		color : req.param('color')
	    }).exec(function(err, ticket) {
		if (err) {
		    return console.log(err);
		} else {
		    console.log("チケットを作成しました：", ticket);
		    Room.publishCreate({
			id: ticket.id, 
			contents: ticket.contents,
			boardId: ticket.boardId,
			createUser : ticket.createUser,
			positionX: ticket.positionX,
			positionY: ticket.positionY,
			color: ticket.color
			nickname : foundUser["nickname"]});
		}
	    });
	});
    } else if (actionType == "destroy") {
      console.log("チケット削除:" + id);
      Ticket.findOne({
        id : id
      }).exec(function(err, found) {
        Ticket.destroy({id: id}).exec(function destroy(err2){
          if(found){
            Room.publishDestroy(found.id);
          }
        });
      });
    } else if (actionType == "update") {
      console.log("チケット更新:" + id + ", " + req.param('contents'));
      Ticket.update({
        id : id
      }, {
        id : id,
        contents : req.param('contents')
      }).exec(function update(err, updated) {
        Room.publishUpdate(updated[0].id,{ contents:updated[0].contents });
      });
    }
  }

};

