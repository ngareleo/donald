import * as jose from "jose";
import type { JWTPayload } from "jose";
import { loadRepository } from "~/internals/repository";

export async function readPemFiles() {
    return {
        publicKey: await Bun.file("./temp/public_key.pem").text(),
        privateKey: await Bun.file("./temp/private_key.pem").text(),
    };
}

export async function getJWT(privateKey: string, userId: string) {
    const pk = await jose.importPKCS8(privateKey, "RS256");
    const jwt = await new jose.SignJWT()
        .setProtectedHeader({ alg: "RS256" })
        .setIssuedAt()
        .setSubject(userId)
        .setExpirationTime("2h")
        .sign(pk);
    return jwt;
}

export type VerifyJWTResponse =
    | "invalid_token"
    | "expired_token"
    | "user_not_found"
    | JWTPayload;

export async function verifyJWT(
    publicKey: string,
    token: string
): Promise<VerifyJWTResponse> {
    const { userRepository } = loadRepository();
    const pk = await jose.importSPKI(publicKey, "RS256");
    let payload;
    try {
        const josePayload = await jose.jwtVerify<JWTPayload>(token, pk);
        payload = josePayload.payload;
    } catch (e) {
        console.error(e);
        return "invalid_token";
    }

    if (!payload || !payload.exp || !payload.sub) {
        return "invalid_token";
    } else if (payload.exp * 1000 <= Date.now()) {
        return "expired_token";
    } else {
        const user = await userRepository?.findUserById(Number(payload.sub));
        if (user == null) {
            return "user_not_found";
        }
        return payload;
    }
}
