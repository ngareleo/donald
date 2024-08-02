import {
    Badge,
    Button,
    Flex,
    Heading,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
} from "@chakra-ui/react";
import * as React from "react";
import {
    mainAppCookieName,
    useMainAppCookie,
} from "../../hooks/useMainAppCookie";
import Cookies from "universal-cookie";
import { redirect, useNavigate } from "react-router-dom";

export const loader = async () => {
    const cookie = new Cookies(null);
    const mainAppCookie = cookie.get(mainAppCookieName);
    if (mainAppCookie) {
        return mainAppCookie.user;
    } else {
        return redirect("/login");
    }
};

export const HomePage = () => {
    const { cookie, removeCookie } = useMainAppCookie();
    const navigate = useNavigate();

    const username = cookie?.["username"];
    const handleLogout = React.useCallback(() => {
        removeCookie();
        navigate("/login");
    }, [removeCookie, redirect]);

    return (
        <Flex p={"50px"} direction={"column"} align={"center"} gap={"50px"}>
            <Flex
                w={"full"}
                h={"30px"}
                mx={"20px"}
                align={"center"}
                justify={"space-between"}
            >
                <Heading as={"h2"}>Mapesa</Heading>
                <Flex>
                    {username && <Text>{username}</Text>}
                    <Button onClick={handleLogout}>Logout</Button>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <TableContainer>
                    <Table variant={"simple"}>
                        <TableCaption>Recent transactions</TableCaption>
                        <Thead>
                            <Th>Date/time</Th>
                            <Th>Subject</Th>
                            <Th>Amount</Th>
                            <Th>Type</Th>
                            <Th>Transaction cost</Th>
                            <Th>Code</Th>
                        </Thead>
                        <Tbody>
                            <Td>{new Date().toDateString()}</Td>
                            <Td>KFC Garden City</Td>
                            <Td isNumeric>200</Td>
                            <Td>
                                <Badge>Lipa</Badge>
                            </Td>
                            <Td isNumeric>0</Td>
                            <Td>HDS9DS8909</Td>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
        </Flex>
    );
};
