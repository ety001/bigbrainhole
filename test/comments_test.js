var http = require('http');
var querystring = require('querystring');

function req_send(options, data, callback){
  var req = http.request(options, callback);
  req.write(data);
  req.end();
}

var test_list = [
  'test_add_comment'
]

function test_add_comment(){
  var _data = {
    web_title : 'test_web_title',
    url : 'http%3A%2F%2Fwww.demohour.com%2Fprojects%2F351614',
    url_hash : '3335cf59a624847a6638ce19c2b98b02',
    comment_text : '<script>alert(123)</script>'
  };
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/comments',
    method: 'POST',
    headers: {  
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
    }
  };
  var MAX = 4;
  for(var i=1; i<=MAX; i++){
    for(var j=i; j<=MAX; j++){
      var _post = {};
      var curt = 1;
      for(var key in _data){
        if(curt>=i && curt<=j){
          _post[key] = _data[key];
        }
        curt++;
      }
      var post_data = querystring.stringify(_post);
      req_send(options, post_data, function(res){
        res.setEncoding('utf8');  
        res.on('data', function (chunk) {  
          console.log(chunk);
          /*if(i==1 && j==MAX){
            if(res.status == 1){
              console.log('test common data success!');
            } else {
              console.log('test common data fail!********',i,j,res,'**********end');
            }
          } else {
            if(res.status == 0 && res.data == 'data not complete'){
              console.log('test uncomplete data success!');
            } else {
              console.log('test uncomplete data fail!********',i,j,res,'**********end');
            }
          }*/
        });
        res.on('error', function(r){
          console.log(r);
        })
          
      });
    }
  }
}

test_add_comment();
