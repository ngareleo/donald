import { Box, Typography } from "@mui/material";
import * as React from "react";

type Props = {
    children?: React.ReactNode;
};

export const Mapesa: React.FC<Props> = (props) => {
    return (
        <Box>
            <Typography variant="h1">Hello Traveler</Typography>
            {props.children}
        </Box>
    );
};
