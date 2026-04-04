import * as jose from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "shieldride-dev-secret-change-me"
);

export async function signJwt(payload: Record<string, unknown>, exp = "7d") {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as { sub?: string; phone?: string };
  } catch {
    return null;
  }
}
