/**
 * BoardController
 * 
 * @description :: Server-side logic for managing boards
 * @help :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `BoardController.index()`
   */
  index : function(req, res) {
    console.log("チケットリスト取得");
    Ticket.find().exec(function(err, users) {
      res.view({list : users});
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
      Ticket.create({
        contents : req.param('contents')
      }).exec(function(err, ticket) {
        if (err) {
          return console.log(err);
        } else {
          console.log("チケットを作成しました：", ticket);
          Room.publishCreate({id: ticket.id, contents: ticket.contents});
        }
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
  },
};
