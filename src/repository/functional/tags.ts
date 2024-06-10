import { and, eq } from "drizzle-orm";
import {
  transactionTagsTable,
  transactionsTable,
  tagsTable,
  getDatabaseInstance,
  type NewTag,
  type NewTransactionTag,
} from "..";

const dbInstance = getDatabaseInstance();

export async function insertNewTag(payload: NewTag | NewTag[]) {
  const pa = Array.isArray(payload) ? payload : [payload];
  // ignore the error below
  return await dbInstance!.insert(tagsTable).values(pa).returning({
    id: tagsTable.id,
    name: tagsTable.name,
    description: tagsTable.description,
  });
}

export async function linkTagToTransaction(payload: NewTransactionTag) {
  // ignore the error below
  return await dbInstance!
    .insert(transactionTagsTable)
    .values(payload)
    .returning({
      id: transactionTagsTable.id,
      tagId: transactionTagsTable.tagId,
      transactionId: transactionTagsTable.transactionId,
    });
}

export async function getAllUserTags(userId: number) {
  return await dbInstance!
    .select()
    .from(tagsTable)
    .where(eq(tagsTable.userId, userId))
    .leftJoin(
      transactionTagsTable,
      eq(tagsTable.id, transactionTagsTable.tagId),
    )
    .leftJoin(
      transactionsTable,
      eq(transactionTagsTable.transactionId, transactionsTable.id),
    );
}

export async function getTagById(userId: number, tagId: Array<number>) {
  return await Promise.all(
    tagId.map(async (id) => {
      return await dbInstance!
        .select()
        .from(tagsTable)
        .where(and(eq(tagsTable.userId, userId), eq(tagsTable.id, id)))
        .leftJoin(
          transactionTagsTable,
          eq(tagsTable.id, transactionTagsTable.tagId),
        )
        .leftJoin(
          transactionsTable,
          eq(transactionTagsTable.transactionId, transactionsTable.id),
        );
    }),
  );
}
