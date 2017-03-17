import jose from "node-jose";


function getKey(hostSecret) {
  return jose.JWK.asKey({
    kty: "oct",
    k: hostSecret
  });
}

export function encrypt(hostSecret, { email, hullToken }) {
  return getKey(hostSecret)
    .then(key => jose.JWE.createEncrypt({ format: "compact" }, key))
    .then((j) => {
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
      const [email, hullToken] = res.payload.toString().split("::");
      return { email, hullToken };
    });
}

export function sign(hostSecret, emailToken) {
  return getKey(hostSecret)
    .then(key => jose.JWS.createSign({ format: "compact" }, key))
    .then((j) => {
      return j.update(emailToken)
        .final();
    });
}


export function exportPublicKey(hostSecret) {

  // return jose.JWK.createKeyStore().generate("oct", 256, props).
  //       then(function(result) {
  //         // {result} is a jose.JWK.Key
  //         key = result;
  //       });

  return getKey(hostSecret)
    .then(key => key.toJSON());
}
