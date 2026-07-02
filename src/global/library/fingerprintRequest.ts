import crypto from "crypto";

const fingerprintRequest = (
  random: string,
): {
  fingerprint: string;
  fingerprintHash: string;
} => {
  const fingerprintHash = crypto
    .createHash("sha256")
    .update(random)
    .digest("hex");

  return {
    fingerprint: random,
    fingerprintHash,
  };
};

export default fingerprintRequest;
