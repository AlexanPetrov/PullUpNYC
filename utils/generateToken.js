import crypto from "crypto";

export const generateHighEntropyToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
