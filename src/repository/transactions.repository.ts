import { db } from "../db/index.db";
import { NewTransaction, transactionsTable } from "../db/schema.db";

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

export const insertNewTransactions = async (transactions: NewTransaction[]) => {
  const insertTimingKey = `inserting ${transactions.length} transactions`;

  console.time(insertTimingKey);
  const res = await Promise.all(
    transactions.map(async (transaction) => {
      return await insert(transaction);
    })
  );
  console.timeEnd(insertTimingKey);

  var allSuccess = true;
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
};

async function insert(
  transaction: NewTransaction
): Promise<InsertResponseType> {
  /// Inserts a single transaction and returns partial of the value
  var newTransaction;
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

    if (e.message.includes("duplicate key value violates unique constraint")) {
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
