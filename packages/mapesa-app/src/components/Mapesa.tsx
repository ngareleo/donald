import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { CookiesProvider } from "react-cookie";
import { LoginPage } from "./pages/Login";
import { HomePage, loader as homeLoader } from "./pages/Home";
import { SignupPage } from "./pages/Signup";
import { ErrorPage } from "./pages/Error";
import { SecretsProvider } from "../context/SecretsProvider";

const routes = createBrowserRouter([
    {
        path: "/",
        // We need to do a auth redirect here before we even render the page
        loader: homeLoader,
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

export const Mapesa = () => {
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
                <SecretsProvider>
                    <CookiesProvider>
                        <RouterProvider router={routes} />;
                    </CookiesProvider>
                </SecretsProvider>
            </div>
        </ChakraProvider>
    );
};
