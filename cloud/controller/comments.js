//公共函数库
var G_FUNC = require('cloud/libs/g_func.js');
//xss过滤
var xss = require('xss');
//数据库初始化
AV.initialize(AV.applicationId, AV.applicationKey);
var item_num = 30;
var BigBrainComments = AV.Object.extend("BigBrain_comments");
var BigBrainList = AV.Object.extend("BigBrain_list");

exports.get_comments = function(req, res){
  var url_hash = req.query.url_hash;
  if(!url_hash){
    G_FUNC.res_ajax(res, {});
  }
  url_hash = xss(req.query.url_hash);
  var page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  var list_query = new AV.Query(BigBrainComments);
  var skip_num = (page - 1) * item_num;
  list_query.equalTo('url_hash', url_hash);
  list_query.skip(skip_num);
  list_query.limit(item_num);
  list_query.descending('createdAt');
  list_query.find()
    .then(function(result){
        G_FUNC.res_ajax(res, result);
    }
  );
}

exports.get_comments_num = function(req, res){
  var url_hash    = req.query.url_hash;
  if(!url_hash){
    G_FUNC.res_ajax(res, {});
  }
  var list_query = new AV.Query(BigBrainComments);
  var msg = { count : 0 };
  if(req.query.url_hash){
    list_query.equalTo('url_hash', url_hash);
    list_query.count().then(function(count){
      if(count>0){
        msg.count = count;
      }
    });
  }
  G_FUNC.res_ajax(res, msg);
}

exports.add_comment = function(req, res){
  var new_comment = new BigBrainComments();
  var msg = {};
  var title = req.body.web_title;
  var url = req.body.url;
  var url_hash = req.body.url_hash;
  var comment = xss(req.body.comment_text);
  if(title && url && url_hash && comment){
    new_comment.save(
      {
          url_hash: url_hash,
          comment: comment
      },
      {
        success: function(obj) {
          var list_query = new AV.Query(BigBrainList);
          list_query.equalTo('url_hash',url_hash);
          list_query.find({
              success: function(result) {
                  //add list
                  if(result.length==0){
                      var new_list_item = new BigBrainList();          
                      new_list_item.save(
                          {title:title, url:url, url_hash:url_hash}
                      );
                  }
              }
          });
          msg.data = comment;
          msg.status = 1;
          G_FUNC.res_ajax(res, msg);
        }
      }
    );
  } else {
    msg.data = "data not complete";
    msg.status = 0;
    G_FUNC.res_ajax(res, msg);
  }
}