function detectHubspot() {
  try {
    var newIdent = {};
    newIdent.email = document.querySelector('[data-field="email"]').value;
    console.log(window.location.pathname, newIdent.email);
    if (newIdent.email) {
      var loaded = loadIdent(newIdent);
      console.log("LOADED", loaded);
      toggleSidebar(loaded ? true : undefined);
    }
  } catch (e) {}
}

// FIXME: detection disabled
// document.body.addEventListener("DOMSubtreeModified", detectHubspot, false);
