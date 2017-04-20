chrome.contextMenus.create({
 title: "Lookup %s in Hull",
 contexts: ["selection", "link"],
 onclick: function(str) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { ident: { email: str.selectionText } });
    chrome.tabs.sendMessage(tabs[0].id, { toggle: true });
  });
  return true;
 }
});

chrome.browserAction.onClicked.addListener(function callback() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { toggle: null });
  });
});
