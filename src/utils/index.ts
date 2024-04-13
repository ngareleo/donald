import * as jose from "jose";
import type { JWTPayload } from "jose";
import { findUserById } from "../repository/user.repository";

export const readPemFiles = async () => {
  return {
    publicKey: await Bun.file("./temp/public_key.pem").text(),
    privateKey: await Bun.file("./temp/private_key.pem").text(),
  };
};

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

export type VerifyJWTResponse =
  | "Invalid"
  | "Expired"
  | "User not found"
  | JWTPayload;

export const verifyJWT = async (
  publicKey: string,
  token: string
): Promise<VerifyJWTResponse> => {
  const pk = await jose.importSPKI(publicKey, "RS256");
  var payload;

  try {
    const { payload: pl } = await jose.jwtVerify<JWTPayload>(token, pk);
    payload = pl;
  } catch (e) {
    return "Invalid";
  }

  if (!payload || !payload.exp || !payload.sub) {
    return "Invalid";
  }

  if (payload.exp * 1000 <= Date.now()) {
    return "Expired";
  }

  const user = await findUserById(Number(payload.sub));
  if (user == null) {
    return "User not found";
  }

  return payload;
};

export type UploadTransactionDTO = {
  agentNumber?: string | null;
  balance: number;
  dateTime: string;
  interest?: number;
  location: string | null;
  messageId: string;
  transactionCode: string;
  transactionAmount: number;
  subject: string | null;
  subjectPhoneNumber?: string | null;
  subjectAccount: string | null;
  transactionCost: number | null;
  type: string;
};
