import {
    type NeonDBType,
    type NewTransaction,
    type PostgresDBType,
    transactionsTable,
} from "..";

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
    private static instance: TransactionsRepository;

    private constructor(props: Props) {
        TransactionsRepository.loadDb = props.loadDbInstance;
    }

    public static getInstance(props?: Props) {
        return (
            TransactionsRepository.instance ||
            (() => {
                if (!props) {
                    throw new Error(
                        "Instance doesn't not exist. Call this method with props first."
                    );
                }
                const n = new TransactionsRepository(props);
                TransactionsRepository.instance = n;
                return n;
            })()
        );
    }

    private static async insert(
        transaction: NewTransaction
    ): Promise<InsertResponseType> {
        const db = TransactionsRepository.loadDb();
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
                // TODO: Get the constraint that was violated and match to attribute
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
        const db = TransactionsRepository.loadDb();

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
