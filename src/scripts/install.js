
function install() {
  var metaTag = document.querySelector('meta[name="connection-url"]');

  if (!metaTag) {
    return false;
  }

  var connectionUrl = metaTag.getAttribute("content");

  var iframe = document.createElement('iframe');
  iframe.id = "hull-preview-iframe"
  iframe.src = connectionUrl;
  iframe.setAttribute("style", "display:none")
  iframe.onload = function(e) {
    var previewMetaTag = iframe.contentDocument
      .querySelector('meta[name="hull-preview"]');
    if (previewMetaTag && previewMetaTag.getAttribute("content") === "ok") {
      chrome.storage.sync.set({ url: connectionUrl }, function() {
        console.log(`Options saved: url=${connectionUrl}`);
        alert("Extension was successfully configured. Now you can start viewing user data in the browser.");
      });
    }
  }
  document.body.appendChild(iframe);
}

install();
