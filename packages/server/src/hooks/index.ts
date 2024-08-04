import { Elysia } from "elysia";
import { Connections, transactionTypeTable } from "server-repository";
import { loadConfigs } from "~/config";

export const useApplicationConfigs = new Elysia({
    name: "useApplicationConfigs",
}).state("config", loadConfigs());

export const useTransactionTypes = new Elysia({
    name: "useTransactionTypes",
}).state(
    "transactionTypes",
    await (async () => {
        const {
            processEnvironment,
            localDbURL,
            testingDbURL,
            migrationsFolder,
            verbose,
        } = loadConfigs();

        const connection = new Connections({
            loadConfig: () => {
                return {
                    processEnvironment,
                    shortLivedDbUrl: testingDbURL,
                    longLivedDbUrl: localDbURL,
                    migrationsFolder,
                    verbose,
                };
            },
        });
        const db = connection?.getLongLivedDBConnection()?.value;
        const types = await db?.select().from(transactionTypeTable);
        return types;
    })()
);
