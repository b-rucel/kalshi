import { sign, constants } from "node:crypto";

export async function generateSignature(
  timestamp: number,
  method: string,
  path: string,
  privateKeyPem: string
): Promise<string> {
  if (timestamp <= 0) {
    throw new Error("Invalid timestamp: must be positive");
  }

  const validMethods = ["GET", "POST", "PUT", "DELETE"];
  if (!validMethods.includes(method.toUpperCase())) {
    throw new Error(`Invalid method: ${method}. Must be one of ${validMethods.join(", ")}`);
  }

  if (!path.startsWith("/")) {
    throw new Error(`Invalid path: ${path}. Must start with /`);
  }

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
