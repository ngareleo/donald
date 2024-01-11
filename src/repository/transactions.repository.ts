import { db } from "../db/index.db";
import { NewTransaction, transactionsTable } from "../db/schema.db";

export const insertNewTransactions = async (transactions: NewTransaction[]) => {
  const newTransaction = await db
    .insert(transactionsTable)
    .values(transactions)
    .returning({
      id: transactionsTable.id,
      messageId: transactionsTable.messageId,
      transactionCode: transactionsTable.transactionCode,
      dateAdded: transactionsTable.dateAdded,
    });

  return newTransaction;
};
