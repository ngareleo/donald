import Elysia, { t } from "elysia";
import { useTransactionTypes } from "~/hooks";
import { useAuthenticateUser } from "~/features/authentication/@hooks";
import { loadRepository } from "~/internals/repository";

const { transactionsRepository } = loadRepository();

/**
 * Receives a payload of transactions uploads the payload atomically
 * @ params Array of transactions
 *
 * @returns {status: OKAY or FAIL, reason?: "Reason for failure if status is FAIL"}
 */
export const UploadBatchTransactions = new Elysia()
    .decorate("repository", transactionsRepository)
    .use(useAuthenticateUser)
    .use(useTransactionTypes)
    .post(
        "/transactions",
        async (context) => {
            const { body, user, store, repository } = context;
            const { raw } = body;
            const transactions = raw.map((transaction) => {
                const transactionType = store.transactionTypes?.find(
                    (type) => type.name === transaction.type
                );
                if (!transactionType) {
                    throw new Error(
                        `Transaction type, ${transactionType}, not found`
                    );
                }

                return {
                    ...transaction,
                    balance: Number(transaction.balance),
                    dateTime: new Date(Number(transaction.dateTime)),
                    interest: transaction.interest
                        ? Number(transaction.interest)
                        : null,
                    messageId: Number(transaction.messageId),
                    transactionAmount: Number(transaction.transactionAmount),
                    transactionCost: Number(transaction.transactionCost),
                    transactionTypeId: transactionType.id,
                    type:
                        store.transactionTypes?.find(
                            (type) => type.name === transaction.type
                        )?.id ?? 0,
                    userId: user?.id,
                };
            });

            const transaction =
                await repository?.insertNewTransactions(transactions);
            return transaction;
        },
        {
            type: "application/json",
            body: t.Object({
                raw: t.Array(
                    t.Object({
                        agentNumber: t.Optional(t.String()),
                        balance: t.String(),
                        dateTime: t.String(),
                        interest: t.Optional(t.String()),
                        location: t.Optional(t.String()),
                        messageId: t.String(),
                        subject: t.String(),
                        subjectAccount: t.Optional(t.String()),
                        subjectPhoneNumber: t.Optional(t.String()),
                        transactionAmount: t.String(),
                        transactionCode: t.String(),
                        transactionCost: t.String(),
                        type: t.String(),
                    })
                ),
            }),
        }
    );
