import {
    Badge,
    Box,
    Flex,
    Heading,
    Link,
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

export const HomePage = () => {
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
                <Link href="/logout">Logout</Link>
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
