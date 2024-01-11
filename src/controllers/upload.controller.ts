import { Elysia, t } from "elysia";

import { insertNewTransactions } from "../repository/transactions.repository";
import {
  authenticateUser,
  loadTransactionTypes,
} from "../middleware/index.middleware";

export const upload = new Elysia()
  .use(authenticateUser)
  .use(loadTransactionTypes)
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { message: error, suggest: "Check your values for null values" };
    }
    if (code === "INTERNAL_SERVER_ERROR") {
      console.error(error);
    }
  })
  .group("/upload", (app) =>
    app.post(
      "/transactions",
      async ({ body, user, store: { transactionTypes } }) => {
        const transactions = body.map((transaction) => {
          const transactionType = transactionTypes.find(
            (type) => type.name === transaction.type
          );
          if (!transactionType) {
            throw new Error("Transaction type not found");
          }
          return {
            ...transaction,
            dateTime: new Date(transaction.dateTime),
            transactionTypeId: transactionType.id,
            type:
              transactionTypes.find((type) => type.name === transaction.type)
                ?.id ?? 0,
            userId: user?.id,
          };
        });

        const res = await insertNewTransactions(transactions);

        return { message: "Success", values: res };
      },
      {
        type: "application/json",
        body: t.Array(
          t.Object({
            agentNumber: t.Optional(t.String()),
            balance: t.Number(),
            dateTime: t.Number(),
            interest: t.Optional(t.Number()),
            location: t.Optional(t.String()),
            messageId: t.Number(),
            subject: t.String(),
            subjectAccount: t.Optional(t.String()),
            subjectPhoneNumber: t.Optional(t.String()),
            transactionAmount: t.Number(),
            transactionCode: t.String(),
            transactionCost: t.Number(),
            type: t.String(),
          })
        ),
      }
    )
  );
