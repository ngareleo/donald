import * as React from "react";

export type AppSecrets = {
    serverUrl: string | null;
};
export const SecretsContext = React.createContext<AppSecrets>({
    serverUrl: null,
});

export const useSecrets = () => React.useContext(SecretsContext);

export const SecretsProvider = (props: { children: React.ReactNode }) => {
    const url = process.env.SERVER_URL || null;

    if (!(typeof url === "string")) {
        throw Error(
            "Missing Server URL in env. Please check .env file for SERVER_URL"
        );
    }

    return (
        <SecretsContext.Provider value={{ serverUrl: url }}>
            {props.children}
        </SecretsContext.Provider>
    );
};
