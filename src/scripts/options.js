function onTextChange(key) {
  return function saveToStorage(event) {
    var value = event.target.value;
    chrome.storage.sync.set({ [key]: value }, function() {
      console.debug(`Options saved: ${key}=${value}`);
    });
  }
}

window.onload = function() {
  console.log("onload");
  Promise.all([
      getConnectorUrl()
  ]).then(function(input, err) {
      var connectorUrl = input[0] || "";
      document.getElementById("url").value = connectorUrl;
  });

  document.getElementById("url").addEventListener("change", onTextChange("url"));
}
