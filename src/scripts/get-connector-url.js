function getConnectorUrl() {
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get("url", function(items) {
      resolve(items.url);
    });
  });
}
