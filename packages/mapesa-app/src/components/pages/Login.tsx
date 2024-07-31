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

type Props = {};

export const LoginPage: React.FC<Props> = () => {
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
                            <Input type={"email"} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Password</FormLabel>
                            <Input type={"password"} />
                        </FormControl>
                        <Button>Submit</Button>
                    </Flex>
                </FormControl>
                <Link>I don't have an account.</Link>
            </Flex>
        </Flex>
    );
};
