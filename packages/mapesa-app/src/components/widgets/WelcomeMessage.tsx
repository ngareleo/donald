import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    CloseButton,
} from "@chakra-ui/react";
import * as React from "react";

type Props = {
    shouldShow: boolean;
    username: string;
    close: () => void;
};

export const WelcomeMessage: React.FC<Props> = (props) => {
    return (
        <>
            {props.shouldShow && (
                <Alert status={"success"}>
                    <AlertIcon />
                    <Box>
                        <AlertTitle>Hello captain {props.username}</AlertTitle>
                        <AlertDescription>
                            Welcome back to Mapesa. We've missed you
                        </AlertDescription>
                    </Box>
                    <CloseButton
                        alignSelf="flex-start"
                        position="relative"
                        right={-1}
                        top={-1}
                        onClick={props.close}
                    />
                </Alert>
            )}
        </>
    );
};
