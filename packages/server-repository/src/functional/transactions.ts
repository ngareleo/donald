import type { NeonDBType, PostgresDBType } from "~/types";
import { type NewTransaction, transactionsTable } from "..";
import postgres from "postgres";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import * as schema from "../schema";

type Props = {
    loadDbInstance: () => NeonDBType | PostgresDBType;
};

export type InsertResponseType = {
    message: "success" | "duplicate" | "unknown";
    value?: {
        id: number;
        messageId: number;
        transactionCode: string;
        dateAdded: Date;
    };
    payload?: NewTransaction;
};

export class TransactionsRepository {
    private static loadDb: Props["loadDbInstance"];
    static dbInstance: ReturnType<typeof PostgresJSDrizzle>;

    constructor(props: Props) {
        TransactionsRepository.loadDb = props.loadDbInstance;
    }

    /*
    We have an issue at the moment with opening these db connection within our current architecture
    This setup gurantees normal operation in dev/prod environment
    However, tests are broken. Good thing we have a foundation and we don't need
    tests at this stage of development. So ignore this for now.
    
    Todo: Will fix above when we reach a stage where tests are needed
    */
    private static loadDbInstance() {
        if (TransactionsRepository.dbInstance) {
            return TransactionsRepository.dbInstance;
        }
        TransactionsRepository.dbInstance = PostgresJSDrizzle(
            postgres(process.env.DB_URL),
            {
                schema,
            }
        );
        return TransactionsRepository.dbInstance;
    }

    private static async insert(
        transaction: NewTransaction
    ): Promise<InsertResponseType> {
        const db = TransactionsRepository.loadDbInstance();
        /// Inserts a single transaction and returns partial of the value
        let newTransaction;
        try {
            newTransaction = await db
                .insert(transactionsTable)
                .values(transaction)
                .returning({
                    id: transactionsTable.id,
                    messageId: transactionsTable.messageId,
                    transactionCode: transactionsTable.transactionCode,
                    dateAdded: transactionsTable.dateAdded,
                });
        } catch (e) {
            if (!(e instanceof Error)) {
                throw e;
            }

            if (
                e.message.includes(
                    "duplicate key value violates unique constraint"
                )
            ) {
                // Todo: Get the constraint that was violated and match to attribute
                console.log("Duplicate key value violates unique constraint");
                return { message: "duplicate" as const, payload: transaction };
            }
        }

        if (!newTransaction || newTransaction.length === 0) {
            console.log("Unknown error, Check logs.");
            return { message: "unknown" as const };
        }
        return { message: "success" as const, value: newTransaction[0] };
    }

    async insertNewTransactions(transactions: NewTransaction[]) {
        const insertTimingKey = `inserting ${transactions.length} transactions`;
        console.time(insertTimingKey);
        const res = await Promise.all(
            transactions.map(async (transaction) => {
                return await TransactionsRepository.insert(transaction);
            })
        );
        console.timeEnd(insertTimingKey);

        let allSuccess = true;
        const oks = [];
        const duplicates = [];
        const failed = [];

        for (const response of res) {
            const { message, value, payload } = response;
            switch (message) {
                case "success":
                    oks.push(value);
                    break;
                case "duplicate":
                    duplicates.push(payload);
                    allSuccess = false;
                    break;
                case "unknown":
                    failed.push(value);
                    allSuccess = false;
                    break;
            }
        }

        return {
            message: allSuccess ? "success" : "partial",
            oks,
            duplicates,
            failed,
        };
    }
}
