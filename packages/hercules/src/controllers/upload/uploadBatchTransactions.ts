import Elysia from "elysia";
import { insertNewTransactions } from "~/repository";
import { useAuthenticateUser, useTransactionTypes } from "~/hooks";
import { IncomingTransactionPayloadDTO } from "./uploadBatchTransactions.meta";

/**
 * Recieves a payload of transactions uploads the payload atomically
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
          (type) => type.name === transaction.type,
        );
        if (!transactionType) {
          throw new Error(`Transaction type, ${transactionType}, not found`);
        }

        return {
          ...transaction,
          balance: Number(transaction.balance),
          dateTime: new Date(Number(transaction.dateTime)),
          interest: transaction.interest ? Number(transaction.interest) : null,
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
      body: IncomingTransactionPayloadDTO,
    },
  );
