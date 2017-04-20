/**
 * Currently disabled
 * @return {Array}
 */
function detectIdent() {
    var newIdent = {};

    // Mailchimp
    try {
      newIdent.email = document.querySelector('#content .lastGroup h4').innerText;
    } catch (e) {}



  return newIdent;
}
