function getToken() {
  return new Promise(function(resolve, reject) {
    chrome.storage.sync.get("token", function(items) {
      resolve(items.token);
    });
  });
}
