chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(tab.status==='complete'){
    //如果是chrome页，则返回
    if(tab.url.substr(0,9)==='chrome://'){
      return;
    }
    var encode_url      = encodeURIComponent(tab.url);
    var title           = encodeURIComponent(tab.title);
    //localStorage.currentTabInfo = JSON.stringfy({encode_url: encode_url, title: title});
    //console.log(localStorage);
  }
});


function check_comments_num(url_hash) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://bigbrainhole.avosapps.com/comments_num?url_hash="+url_hash, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var resp = JSON.parse(xhr.responseText);
      var msg;
      if(resp.count>0){
        msg = '当前页面有'+count+'条吐槽';
      } else {
        msg = '当前页面暂无吐槽';
      }
      chrome.notifications.create('',{type:'basic',iconUrl:'icon-128.png',title:'Big Brain Hole',message:msg},function(notification_id){});
    }
  }
  xhr.send();
}
//公共函数
var G = {
  params_2_txt : function(params){
    //处理待提交的参数
    var params_arr = [];
    for(var k in params){
      params_arr.push(k + '=' + params[k]);
    }
    var params_txt = '';
    params_txt = params_arr.join('&');
    return params_txt;
  }
}
//类库
var Dan = function(){
  this.send_url = 'https://dev.bigbrainhole.avosapps.com/comments';
}
Dan.prototype.send_comment = function(url, page_title, comment ,callback){
  var url_hash    = $.md5(url);
  var xhr = new XMLHttpRequest();
  xhr.open('POST', this.send_url, true);
  //设置POST请求的请求头
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      callback(JSON.parse(xhr.responseText));
    }
  }
  var params = {web_title: page_title, url: url, url_hash: url_hash, comment_text: comment};
  xhr.send(G.params_2_txt(params));
}