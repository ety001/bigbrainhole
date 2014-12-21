chrome.browserAction.onClicked.addListener(function(tab) {
  var encode_url = encodeURIComponent(tab.url);
  var title = encodeURIComponent(tab.title);
  chrome.windows.create(
    {url: "main.html?" + encode_url + '#' + title , type: "popup", width: 400, height: 675}
  );
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if(tab.status==='complete'){
    check_comments_num( $.md5( encodeURIComponent(tab.url) ) );
    if(tab.url.substr(0,9)==='chrome://'){
      return;
    }
    var windowID = tab.windowId;
    chrome.tabs.getAllInWindow(windowID,function(win){
      console.log(win);
    });
    console.log(tab);
    var url = parseURL(tab.url);
    var temp = canPublish(1, url, tab.url);
  }
});

function check_comments_num(url_hash) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://bigbrainhole.avosapps.com/comments_num", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      var resp = JSON.parse(xhr.responseText);
      var msg;
      if(resp.count>0){
        msg = '当前页面有'+count+'条吐槽';
      } else {
        msg = '当前页面暂无吐槽';
      }
      chrome.notifications.create('',{type:'basic',iconUrl:'icon.png',title:'Big Brain Hole',message:msg},function(notification_id){});
    }
  }
  xhr.send();
}