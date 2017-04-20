var actualIdent = {};

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function loadIdent(newIdent) {
  if (JSON.stringify(newIdent) === JSON.stringify(actualIdent)) {
    return false;
  }
  actualIdent = newIdent;

  getConnectorUrl()
    .then(function(connectorUrl) {
      var encodedIdent = encodeIdent(newIdent);
      loadIframe(connectorUrl + "&ident=" + encodedIdent);
    });
  return true;
}

function toggleSidebar(show) {
  var shown = document.getElementById("hull-preview") ?
    document.getElementById("hull-preview").style.display === "block"
    : false;
  if ((shown && show !== true) || show === false) {
    shown = false;
    return document.getElementById("hull-preview").style.display = "none";
  }

  shown = true;
  return document.getElementById("hull-preview").style.display = "block";
}

window.addEventListener("load", function() {
  injectSidebar();
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

      if (request.ident) {
        loadIdent(request.ident);
      }

      if (request.toggle !== undefined) {
        toggleSidebar(request.toggle);
      }
  });

  document.addEventListener('mouseup',function(event) {
      var sel = window.getSelection().toString().trim();
      if (sel.length && validateEmail(sel)) {
        var loaded = loadIdent({ email: sel });
        toggleSidebar(loaded ? true : undefined);
      }
  });

  var event = document.createEvent("CustomEvent");
  event.initCustomEvent("hull-preview-init", true, true, {});
  document.dispatchEvent(event);

}, false);
