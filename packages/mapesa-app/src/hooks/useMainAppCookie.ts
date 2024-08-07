import { useCookies } from "react-cookie";
import type { Cookie, CookieSetOptions } from "universal-cookie";

export const mainAppCookieName = "mainAppCookie";
const twoDays = 60 * 60 * 24 * 2;

const defaultOptions: CookieSetOptions = {
    maxAge: twoDays,
    secure: true,
    path: "/",
};

export const useMainAppCookie = () => {
    const [cookies, setCookie, removeCookie] = useCookies([mainAppCookieName]);
    return {
        cookie: cookies.mainAppCookie,
        setCookie: (b: Cookie, c?: CookieSetOptions) => {
            setCookie(mainAppCookieName, b, { ...defaultOptions, ...c });
        },
        removeCookie: () => {
            removeCookie(mainAppCookieName);
        },
    };
};
