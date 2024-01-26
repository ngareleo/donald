import { Elysia, t } from "elysia";

import {
  authenticateUser,
  loadTransactionTypes,
} from "../middleware/index.middleware";
import { insertNewTransactions } from "../repository/transactions.repository";

export const upload = new Elysia()
  .use(authenticateUser)
  .use(loadTransactionTypes)
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { message: error, suggest: "Check your values for null values" };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      set.status = 500;
      return { message: "Internal server error", error: error.message };
    }
  })
  .guard({}, (app) =>
    app.group("/upload", (app) =>
      app.post(
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
                transactionTypes.find((type) => type.name === transaction.type)
                  ?.id ?? 0,
              userId: user?.id,
            };
          });
          
          return await insertNewTransactions(transactions);
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
      )
    )
  );
