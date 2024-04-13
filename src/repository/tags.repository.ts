import { and, eq } from "drizzle-orm";
import { db } from "../db";
import {
  type NewTag,
  tagsTable,
  type NewTransactionTag,
  transactionTagsTable,
  transactionsTable,
} from "../db/schema.db";

export const insertNewTag = async (payload: NewTag | NewTag[]) => {
  const pa = Array.isArray(payload) ? payload : [payload];
  return await db.insert(tagsTable).values(pa).returning({
    id: tagsTable.id,
    name: tagsTable.name,
    description: tagsTable.description,
  });
};

export const linkTagToTransaction = async (payload: NewTransactionTag) => {
  return await db.insert(transactionTagsTable).values(payload).returning({
    id: transactionTagsTable.id,
    tagId: transactionTagsTable.tagId,
    transactionId: transactionTagsTable.transactionId,
  });
};

export const getAllUserTags = async (userId: number) => {
  return await db
    .select()
    .from(tagsTable)
    .where(eq(tagsTable.userId, userId))
    .leftJoin(
      transactionTagsTable,
      eq(tagsTable.id, transactionTagsTable.tagId)
    )
    .leftJoin(
      transactionsTable,
      eq(transactionTagsTable.transactionId, transactionsTable.id)
    );
};

export const getTagById = async (userId: number, tagId: Array<number>) => {
  return await Promise.all(
    tagId.map(async (id) => {
      return await db
        .select()
        .from(tagsTable)
        .where(and(eq(tagsTable.userId, userId), eq(tagsTable.id, id)))
        .leftJoin(
          transactionTagsTable,
          eq(tagsTable.id, transactionTagsTable.tagId)
        )
        .leftJoin(
          transactionsTable,
          eq(transactionTagsTable.transactionId, transactionsTable.id)
        );
    })
  );
};
