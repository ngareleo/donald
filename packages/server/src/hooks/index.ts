import { Elysia, t } from "elysia";
import { getDatabaseInstance, transactionTypeTable } from "server-repository";
import { loadConfigs } from "~/config";

export const useMainApplicationErrorHandling = new Elysia().onError(
    ({ code, error, set }) => {
        if (code === "VALIDATION") {
            console.error(error);
        }
        switch (code) {
            case "NOT_FOUND":
                set.status = 404;
                return "Not Found :(";

            case "INTERNAL_SERVER_ERROR":
                set.status = 500;
                return "Internal Server Error :(";

            default:
                set.status = 400;
                return "Bad Request :(";
        }
    }
);

export const useApplicationConfigs = new Elysia().state(
    "config",
    loadConfigs()
);

export const useTransactionTypes = new Elysia().state(
    "transactionTypes",
    await (async () => {
        const db = getDatabaseInstance();
        const types = await db.select().from(transactionTypeTable);
        return types;
    })()
);
