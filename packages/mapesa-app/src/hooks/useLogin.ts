import * as React from "react";
import { useSecrets } from "../context/SecretsProvider";
import { useMainAppCookie } from "./useMainAppCookie";

export const useLogin = () => {
    const { serverUrl } = useSecrets();
    const { setCookie } = useMainAppCookie();
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

            const { user, token, message } = await response.json();
            if (message === "OK") {
                setCookie(
                    JSON.stringify({ user, message, token }) // recommended to stringify cookie content first
                );
            }
        },
        [serverUrl, setCookie]
    );

    return { handleLoginRequest };
};
