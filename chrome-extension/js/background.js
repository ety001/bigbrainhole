AV.initialize("tg7xkgxtxp6k1z28883mwkzv8bfriqtfot4ln8dbi01wtjmv", "vpmzwg2ttv276mk4ea7666fz0j62ov2gver8xdb47m8vigpj");

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  var url = parseURL(tab.url);
  var temp = canPublish(url);
  if(!temp) {
     return;
  }
  var encode_url = encodeURIComponent(tab.url);
  var title = encodeURIComponent(tab.title);
  chrome.windows.create(
    {url: "main.html?" + encode_url + '#' + title , type: "popup", width: 400, height: 675}
  );
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

function canPublish(url) {
  var path = url.path.split('/');
  switch(url.host) {
    case 'www.demohour.com':
      if(path[1] !== 'projects') {
        alert('暂不支持该页面吐槽');
        return false;
      }
      break;
    default:
      alert('暂不支持该网站吐槽');
      return false;
  }
  return true;
}