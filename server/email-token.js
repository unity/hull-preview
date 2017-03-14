import jose from "node-jose";


function getKey(hostSecret) {
  return jose.JWK.asKey({
    kty: "oct",
    k: hostSecret
  });
}

export function encrypt(hostSecret, { email, hullToken }) {
  return getKey(hostSecret)
    .then((key) => jose.JWE.createEncrypt({ format: "compact" }, key))
    .then(j => {
      const emailToken = [email, hullToken].join("::");
      return j
        .update(emailToken)
        .final();
    });
}


export function decrypt(hostSecret, emailToken) {
  return getKey(hostSecret)
    .then((key) => {
      return jose.JWE.createDecrypt(key)
        .decrypt(emailToken);
    })
    .then((res) => {
      var [ email, hullToken ] = res.payload.toString().split("::");
      return { email, hullToken };
    });
}


