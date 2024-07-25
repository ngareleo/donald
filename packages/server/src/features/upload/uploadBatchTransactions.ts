import Elysia, { t } from "elysia";
import { TransactionsRepository } from "server-repository";
import { useTransactionTypes } from "~/hooks";
import { useAuthenticateUser } from "~/features/authentication/@hooks";

/**
 * Receives a payload of transactions uploads the payload atomically
 * @ params Array of transactions
 *
 * @returns {status: OKAY or FAIL, reason?: "Reason for failure if status is FAIL"}
 */
export const UploadBatchTransactions = new Elysia()
    .use(useAuthenticateUser)
    .use(useTransactionTypes)
    .post(
        "/transactions",
        async ({ body, user, store: { transactionTypes } }) => {
            const { raw } = body;
            const transactions = raw.map((transaction) => {
                const transactionType = transactionTypes.find(
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
                        transactionTypes.find(
                            (type) => type.name === transaction.type
                        )?.id ?? 0,
                    userId: user?.id,
                };
            });
            return await new TransactionsRepository().insertNewTransactions(
                transactions
            );
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
