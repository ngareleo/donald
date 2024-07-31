import * as React from "react";
import { Flex, Heading, Link, Text } from "@chakra-ui/react";

export const ErrorPage = () => {
    return (
        <Flex w={"full"} h={"full"} align={"center"} justify={"center"}>
            <Flex direction={"column"}>
                <Heading>We're lost</Heading>
                <Text>
                    Seems like we're lost at sea. Let's find our way{" "}
                    <Link href="/">on course</Link>
                </Text>
            </Flex>
        </Flex>
    );
};
