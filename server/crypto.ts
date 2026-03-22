import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || "0".repeat(64), "hex"); // 32바이트

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag().toString("hex");
  return iv.toString("hex") + ":" + tag + ":" + encrypted;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, tagHex, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/** 주민등록번호 마스킹: 앞 6자리만 표시 */
export function maskSSN(ssn: string): string {
  if (!ssn || ssn.length < 6) return "******-*******";
  return ssn.substring(0, 6) + "-*******";
}

/** 계좌번호 마스킹: 뒤 4자리만 표시 */
export function maskAccount(account: string): string {
  if (!account || account.length < 4) return "****";
  return "*".repeat(account.length - 4) + account.slice(-4);
}
