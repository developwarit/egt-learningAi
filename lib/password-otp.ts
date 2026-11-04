import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const identifierFor = (userId: string) => `pwd-otp:${userId}`;

const hashOf = (identifier: string, code: string) =>
  crypto
    .createHash("sha256")
    .update(`${identifier}:${code}:${process.env.NEXTAUTH_SECRET ?? ""}`)
    .digest("hex");

function parseToken(token: string) {
  const [hash, attempts] = token.split(".");
  return { hash, attempts: Number(attempts ?? "0") || 0 };
}

// สร้างรหัส 6 หลักใหม่ (แทนของเดิมเสมอ) เก็บเฉพาะ hash ลง VerificationToken
export async function createPasswordOtp(userId: string) {
  const identifier = identifierFor(userId);
  const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
  const expires = new Date(Date.now() + TTL_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: { identifier, token: `${hashOf(identifier, code)}.0`, expires },
  });

  return { code, expires };
}

export type OtpVerifyResult = "ok" | "invalid" | "expired" | "locked";

export async function verifyPasswordOtp(userId: string, code: string): Promise<OtpVerifyResult> {
  const identifier = identifierFor(userId);
  const record = await prisma.verificationToken.findFirst({ where: { identifier } });

  if (!record) return "expired";

  if (record.expires.getTime() < Date.now()) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return "expired";
  }

  const { hash, attempts } = parseToken(record.token);

  if (attempts >= MAX_ATTEMPTS) {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
    return "locked";
  }

  if (hash !== hashOf(identifier, code)) {
    await prisma.verificationToken.updateMany({
      where: { identifier },
      data: { token: `${hash}.${attempts + 1}` },
    });
    return "invalid";
  }

  await prisma.verificationToken.deleteMany({ where: { identifier } });
  return "ok";
}
