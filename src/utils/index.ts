import * as jose from "jose";

export const getJWT = async (privateKey: string, userId: string) => {
  const pk = await jose.importPKCS8(privateKey, "RS256");
  const jwt = await new jose.SignJWT()
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setSubject(userId)
    .setExpirationTime("2h")
    .sign(pk);
  return jwt;
};

export const verifyJWT = async (publicKey: string, token: string) => {
  const pk = await jose.importSPKI(publicKey, "RS256");
  return await jose.jwtVerify(token, pk);
};
