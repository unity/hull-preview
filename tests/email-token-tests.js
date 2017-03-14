import assert from "assert";

import * as emailToken from "../server/email-token";

describe("emailToken", () => {
  it("should allow encrypt and decrypt", function(done) {
    const hostSecret = "3qyTVhIWt5juqZUCpfRqpvauwB956MEJL2Rt-8qXKSo";
    const input = { email: "me@michaloo.net", hullToken: "1234" };

    emailToken.encrypt(hostSecret, input)
    .then((encrypted) => {
      return emailToken.decrypt(hostSecret, encrypted)
      .then((decrypted) => {
        assert.deepEqual(decrypted, input);
        done();
      });
    })
    .catch(err => console.error(err.stack));
  });
});
