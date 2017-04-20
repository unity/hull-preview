function detectSalesforce() {
  try {
    var newIdent = {};
    newIdent.email = document.querySelector('.detailList [href*="mailto:"').text;

    if (!newIdent.email) {
      newIdent.email = document.querySelector('.listRelatedObject.contactBlock [href*="mailto:"').text;
    }

    var loaded = loadIdent(newIdent);
    toggleSidebar(loaded ? true : undefined);
  } catch (e) {}
}

document.addEventListener("hull-preview-init", detectSalesforce, false);
