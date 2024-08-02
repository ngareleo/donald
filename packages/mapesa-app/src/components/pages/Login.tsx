import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
    useDisclosure,
} from "@chakra-ui/react";
import * as React from "react";
import { useLogin } from "../../hooks/useLogin";
import { WelcomeMessage } from "../widgets/WelcomeMessage";
import { redirect, useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
    // do a auth validation
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loggedInUser, setLoggedInUser] = React.useState();

    const { handleLogin, isUserValid } = useLogin();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const navigate = useNavigate();

    const formSubmitHandler = React.useCallback(async () => {
        // validate form
        const isFormValid = Boolean(username) && Boolean(password);
        if (!isFormValid) {
            return;
        }
        const { user } = await handleLogin({
            username: username || "",
            password: password || "",
        });

        if (!isUserValid(user)) {
            return;
        }
        setLoggedInUser(user);
        onOpen();
        navigate("/");
    }, [username, password]);

    return (
        <Flex w={"100%"} h={"100%"} align={"center"} justify={"center"}>
            <Flex
                direction={"column"}
                gap={"20px"}
                mt={"30px"}
                align={"center"}
            >
                {loggedInUser && (
                    <WelcomeMessage
                        shouldShow={isOpen}
                        username={loggedInUser["username"]}
                        close={onClose}
                    />
                )}
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
