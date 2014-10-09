AV.initialize("tg7xkgxtxp6k1z28883mwkzv8bfriqtfot4ln8dbi01wtjmv", "vpmzwg2ttv276mk4ea7666fz0j62ov2gver8xdb47m8vigpj");
var BigBrainComments = AV.Object.extend("BigBrain_comments");


chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  var url = parseURL(tab.url);
  var temp = canPublish(0, url, tab.url);
  if(!temp) {
     return;
  }
  var encode_url = encodeURIComponent(tab.url);
  var title = encodeURIComponent(tab.title);

  chrome.windows.create(
    {url: "main.html?" + encode_url + '#' + title , type: "popup", width: 400, height: 675}
  );
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(tab.status=='complete'){
    var url = parseURL(tab.url);
    var temp = canPublish(1, url, tab.url);
  }
});

function parseURL(url) {
  var result = {};
  var match = url.match(
      /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
  if (!match)
    return result;
  result.scheme = match[1].toLowerCase();
  result.host = match[2];
  result.port = match[3];
  result.path = match[4] || "/";
  result.fragment = match[5];
  return result;
}

function canPublish(c_type, url, origin_url) {
  if(url.scheme !== 'http' && url.scheme !== 'https')return false;
  var path = url.path.split('/');
  //点名时间
  if(url.host !== 'www.demohour.com'){
    alert('暂不支持该网站吐槽');
    return false;
  }
  if(path[1] !== 'projects') {
    alert('暂不支持该页面吐槽');
    return false;
  }

  if(c_type == 1){
    check_comments_num( $.md5( encodeURIComponent(origin_url) ) );
  }
  return true;
}

function check_comments_num(url_hash) {
  var list_query = new AV.Query(BigBrainComments);
  var msg;
  list_query.equalTo('url_hash', url_hash);
  list_query.count().then(function(count){
    if(count>0){
      msg = '当前页面有'+count+'条吐槽';
    } else {
      msg = '当前页面暂无吐槽';
    }
    chrome.notifications.create('',{type:'basic',iconUrl:'icon.png',title:'Big Brain Hole',message:msg},function(notification_id){});
  });
}