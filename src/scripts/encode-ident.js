function b64EncodeUnicode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
  }));
}

/**
 * @param  {Object} ident
 * @return {String}
 */
function encodeIdent(ident) {
  return b64EncodeUnicode(JSON.stringify(ident));
}
