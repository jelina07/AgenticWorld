import * as paillier from "mind-paillier-voting-sdk";
self.onmessage = async (e) => {
  try {
    const { userInputBinary, sPublicKey } = e.data;
    const publicKey = paillier.deserializePublicKey(sPublicKey);
    const VOTER = new paillier.Voter(129, publicKey);
    const userInputBigInt = BigInt(`0b${userInputBinary}`);
    //@ts-ignore
    const encrypted = VOTER.encryptNumber(userInputBigInt);
    const proofs = JSON.stringify(encrypted, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    );
    self.postMessage({ success: true, proofs });
  } catch (err) {
    self.postMessage({ success: false, error: (err as Error).message });
  }
};
