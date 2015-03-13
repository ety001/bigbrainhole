//公共函数
var G = {
  charge_page : function(url){
    //判断页面是否可以执行扩展
    var t = url.split(':');
    var black = ['chrome-devtools','chrome','chrome-extension'];
    for(var i in black){
      if(t[0] === black[i]){
        return false;
      }
    }
    return true;
  },
  params_2_txt : function(params){
    //处理待提交的参数
    var params_arr = [];
    for(var k in params){
      params_arr.push(k + '=' + params[k]);
    }
    var params_txt = '';
    params_txt = params_arr.join('&');
    return params_txt;
  },
  xhr_send : function(url, send_type, send_data, callback){
    if(!send_type)send_type = 'get';
    if(send_type=='get'){
      url = url + '?' + G.params_2_txt(send_data);
    }
    var xhr = new XMLHttpRequest();
    xhr.open(send_type, url, true);
    if(send_type=='post'){
      //设置POST请求的请求头
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    } 
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        callback(JSON.parse(xhr.responseText));
      }
    }
    xhr.send(G.params_2_txt(send_data));
  }
}

//类库
var Dan = function(){
  this.send_url = 'https://bigbrainhole.avosapps.com/comments';
  this.get_url = 'https://bigbrainhole.avosapps.com/comments';
  this.num_url = 'https://bigbrainhole.avosapps.com/comments_num';
}
Dan.prototype.send_comment = function(url, page_title, comment ,callback){
  var url_hash    = $.md5(url);
  var params = {web_title: page_title, url: url, url_hash: url_hash, comment_text: comment};
  G.xhr_send(this.send_url, 'post', params, callback);
}
Dan.prototype.get_comments = function(url_hash, page, callback){
  if(!page)page = 1;
  G.xhr_send(this.get_url, 'get', {url_hash: url_hash, page: page}, callback);
}
Dan.prototype.get_comments_num = function(url_hash){
  G.xhr_send(this.num_url, 'get', {url_hash: url_hash}, callback);
}


chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
  if(tab.status=='complete'){
    if(G.charge_page(tab.url)){
      var js_url = 'https://bigbrainhole.avosapps.com/tucao.js';
      chrome.tabs.executeScript({
        code: 'var o =document.createElement("script");\
        o.type="text/javascript";\
        o.charset="utf-8";\
        o.src="'+js_url+'";\
        document.body.appendChild(o);\
        document.cookie="bigbrainhole_url_hash='+$.md5(tab.url)+'";'
      });
    }
  }
});









