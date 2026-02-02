import { describe, it, expect, beforeAll } from "bun:test";
import { generateSignature } from "./auth";
import { generateKeyPairSync } from "node:crypto";

describe("auth module", () => {
    let privateKeyPem: string;

    beforeAll(() => {
        // Generate a temporary RSA key pair for testing
        const { privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: "spki",
                format: "pem",
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            },
        });
        privateKeyPem = privateKey;
    });

    describe("generateSignature", () => {
        it("should generate a signature string", async () => {
            const timestamp = Date.now();
            const method = "GET";
            const path = "/trade-api/v2/portfolio/balance";

            const signature = await generateSignature(timestamp, method, path, privateKeyPem);

            expect(signature).toBeString();
            expect(signature.length).toBeGreaterThan(0);
        });

        it("should generate different signatures for different inputs", async () => {
            const timestamp = Date.now();
            const method = "GET";
            const path = "/trade-api/v2/portfolio/balance";

            const sig1 = await generateSignature(timestamp, method, path, privateKeyPem);
            const sig2 = await generateSignature(timestamp + 1000, method, path, privateKeyPem);

            expect(sig1).not.toBe(sig2);
        });

        it("should throw error with invalid private key", () => {
            const timestamp = Date.now();
            const method = "GET";
            const path = "/trade-api/v2/portfolio/balance";
            const invalidKey = "invalid-key";

            expect(generateSignature(timestamp, method, path, invalidKey)).rejects.toThrow();
        });

        it("should throw error with invalid timestamp", () => {
            const timestamp = 0;
            const method = "GET";
            const path = "/trade-api/v2/portfolio/balance";

            expect(generateSignature(timestamp, method, path, privateKeyPem)).rejects.toThrow("Invalid timestamp");
        });

        it("should throw error with invalid method", () => {
            const timestamp = Date.now();
            const method = "INVALID";
            const path = "/trade-api/v2/portfolio/balance";

            expect(generateSignature(timestamp, method, path, privateKeyPem)).rejects.toThrow("Invalid method");
        });

        it("should throw error with invalid path", () => {
            const timestamp = Date.now();
            const method = "GET";
            const path = "no-leading-slash";

            expect(generateSignature(timestamp, method, path, privateKeyPem)).rejects.toThrow("Invalid path");
        });
    });
});
