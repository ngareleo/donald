import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/Login.tsx";
import { HomePage } from "./pages/Home.tsx";
import { SignupPage } from "./pages/Signup.tsx";
import { ErrorPage } from "./pages/Error.tsx";
import { ChakraProvider } from "@chakra-ui/react";

type Props = {
    children?: React.ReactNode;
};

const routes = createBrowserRouter([
    {
        path: "/",
        Component: HomePage,
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "register",
        Component: SignupPage,
    },
    {
        path: "*",
        Component: ErrorPage,
    },
]);

export const Mapesa: React.FC<Props> = () => {
    return (
        <ChakraProvider>
            <div
                style={{
                    padding: 0,
                    margin: 0,
                    boxSizing: "border-box",
                    width: "100vw",
                    height: "100vh",
                }}
            >
                <RouterProvider router={routes} />;
            </div>
        </ChakraProvider>
    );
};
