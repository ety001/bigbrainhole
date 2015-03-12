var bgPage      = chrome.extension.getBackgroundPage();
var url         = '';
var page_title  = '';
$(function(){
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var tab = tabs[0];
    if(tab.status==='complete'){
      //如果是chrome页，则返回
      if(tab.url.substr(0,9)==='chrome://'){
        return;
      }
      url           = encodeURIComponent(tab.url);
      page_title    = encodeURIComponent(tab.title);
    }
  });
  $('#submit_comment').click(function(){
    var comment     = $('#comment_input').val();
    if(!comment){
      $('#msg').html('请输入要吐槽的内容！');
    }
    var dan = new bgPage.Dan();
    dan.send_comment(url, page_title, comment, function(res){
      if(res.status==1){
        chrome.notifications.create(
          '',
          {
            type:'basic',
            iconUrl:'icon-128.png',
            title:'Big Brain Hole',
            message:'已经在该页面吐槽成功'
          },
          function(notification_id){}
        );
        $('#comment_input').val('');
        window.close();
      } else {
        $('#msg').html('吐槽失败');
      }
    });
  });
});