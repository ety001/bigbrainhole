AV.initialize("tg7xkgxtxp6k1z28883mwkzv8bfriqtfot4ln8dbi01wtjmv", "vpmzwg2ttv276mk4ea7666fz0j62ov2gver8xdb47m8vigpj");

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  var encode_url = encodeURIComponent(tab.url);
  chrome.windows.create(
    {url: "main.html?" + encode_url, type: "popup", width: 400, height: 600}
  );
});