import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
} from "@chakra-ui/react";
import * as React from "react";
import { useCookies } from "react-cookie";
import { useSecretsContext } from "../../context/SecretsProvider";

const mainAppCookieName = "mainAppCookie";
const twoDays = 60 * 60 * 24 * 2;

export const LoginPage: React.FC = () => {
    // do a auth validation

    const [username, setUsername] = React.useState<string | null>(null);
    const [password, setPassword] = React.useState<string | null>(null);
    const { serverUrl } = useSecretsContext();

    const [cookies, setCookie] = useCookies([mainAppCookieName]);
    const userCookie = cookies["mainAppCookie"];

    const formSubmitHandler = React.useCallback(async () => {
        // validate form
        const isFormValid = Boolean(username) && Boolean(password);
        if (!isFormValid) {
            return;
        }

        let response;
        try {
            response = await fetch(serverUrl || "", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subject: username,
                    password: password,
                }),
            });
        } catch (e) {
            console.error(e);
            return;
        }

        const { user, token, message } = await response.json();
        if (message === "OK") {
            setCookie(
                mainAppCookieName,
                JSON.stringify({ user, message, token }), // recommended to stringify cookie content first
                { path: "/", maxAge: twoDays, secure: true }
            );
        }
    }, [username, password]);

    return (
        <Flex w={"100%"} h={"100%"} align={"center"} justify={"center"}>
            <Flex
                direction={"column"}
                gap={"20px"}
                mt={"30px"}
                align={"center"}
            >
                <Heading as={"h2"}>Hey there Traveller</Heading>
                <FormControl>
                    <Flex gap={"10px"} direction={"column"}>
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input
                                type={"email"}
                                onChange={(e) => {
                                    setUsername(e.currentTarget.value);
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type={"password"}
                                onChange={(e) => {
                                    setPassword(e.currentTarget.value);
                                }}
                            />
                        </FormControl>
                        <Button onClick={formSubmitHandler}>Submit</Button>
                    </Flex>
                </FormControl>
                <Link>I don't have an account.</Link>
            </Flex>
        </Flex>
    );
};
