import { sign, constants } from "node:crypto";

export async function generateSignature(
  timestamp: number,
  method: string,
  path: string,
  privateKeyPem: string
): Promise<string> {
  const payload = `${timestamp}${method}${path}`;
  
  const signature = sign(
    "sha256",
    Buffer.from(payload),
    {
      key: privateKeyPem,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
    }
  );

  return signature.toString("base64");
}
