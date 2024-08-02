import * as React from "react";
import { useSecrets } from "../context/SecretsProvider";
import { useMainAppCookie } from "./useMainAppCookie";
// import ky from "ky";

// Todo: Get this type from Elysia using EdenTreaty https://elysiajs.com/eden/treaty/overview.html
type ServerResponseType = {
    user?: {
        email: string;
        username: string;
        id: string;
        phoneNumber: string;
        dateAdded: string;
        lastModified: string;
    };
    token?: string;
    message: string;
};

const mockSuccessServerResponse: ServerResponseType = {
    user: {
        email: "leo@gmail.com",
        username: "leo",
        id: "1",
        phoneNumber: "0723432432423",
        dateAdded: Date.now.toString(),
        lastModified: Date.now.toString(),
    },
    token: "12345",
    message: "OK",
};

export const useLogin = () => {
    const { serverUrl } = useSecrets();
    const { setCookie } = useMainAppCookie();
    const handleLogin = React.useCallback(
        async (props: { username: string; password: string }) => {
            /////////////////////////////////////
            console.log("Props received ", props);
            /////////////////////////////////////

            // Todo: Will do this in a follow up after server is hoisted and ready

            // const response = await ky
            //     .post(serverUrl || "", {
            //         json: {
            //             subject: props.username,
            //             password: props.password,
            //         },
            //     })
            //     .json<ServerResponseType>();
            // const { message } = response;

            if (true) {
                setCookie(
                    JSON.stringify({ ...mockSuccessServerResponse }) // It's recommended to stringify cookie content first
                );
            }
            return {
                user: mockSuccessServerResponse,
            };
        },
        [serverUrl, setCookie]
    );

    const isUserValid = React.useCallback((user: any) => {
        return true;
    }, []);

    return { handleLogin, isUserValid };
};
