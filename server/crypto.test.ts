import { describe, it, expect } from "vitest";
import { encrypt, decrypt, maskSSN, maskAccount } from "./crypto";

describe("crypto module", () => {
  it("should encrypt and decrypt text correctly", () => {
    const original = "주민등록번호: 900101-1234567";
    const encrypted = encrypt(original);
    expect(encrypted).not.toBe(original);
    expect(encrypted).toContain(":");
    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it("should produce different ciphertext for same input (random IV)", () => {
    const text = "test-data";
    const enc1 = encrypt(text);
    const enc2 = encrypt(text);
    expect(enc1).not.toBe(enc2);
    expect(decrypt(enc1)).toBe(text);
    expect(decrypt(enc2)).toBe(text);
  });

  it("should mask SSN correctly", () => {
    expect(maskSSN("900101-1234567")).toBe("900101-*******");
    expect(maskSSN("12345")).toBe("******-*******");
  });

  it("should mask account number correctly", () => {
    expect(maskAccount("110-123-456789")).toBe("**********6789");
    expect(maskAccount("12")).toBe("****");
  });
});
