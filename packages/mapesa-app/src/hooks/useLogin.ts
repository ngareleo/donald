import * as React from "react";
import { useSecrets } from "../context/SecretsProvider";
import { useMainAppCookie } from "./useMainAppCookie";

const mockUser = { user: "leo", token: "12345" };
export const useLogin = () => {
    const { serverUrl } = useSecrets();
    const { setCookie, cookies } = useMainAppCookie();
    const handleLoginRequest = React.useCallback(
        async (props: { username: string; password: string }) => {
            let response;
            try {
                response = await fetch(serverUrl || "", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        subject: props.username,
                        password: props.password,
                    }),
                });
            } catch (e) {
                console.error(e);
                return;
            }

            const { message } = await response.json();
            if (message === "OK") {
                setCookie(
                    JSON.stringify({ ...mockUser }) // recommended to stringify cookie content first
                );
            }

            return { user: mockUser, cookie: cookies.mainAppCookie };
        },
        [serverUrl, setCookie]
    );

    return { handleLoginRequest };
};
