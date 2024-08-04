import { and, eq } from "drizzle-orm";
import {
    transactionTagsTable,
    transactionsTable,
    tagsTable,
    type NewTag,
    type NewTransactionTag,
} from "..";
import type { NeonDBType, PostgresDBType } from "~/types";

type Props = {
    loadDbInstance: () => NeonDBType | PostgresDBType;
};

export class TagsRepository {
    static loadDb: Props["loadDbInstance"];

    constructor(props: Props) {
        TagsRepository.loadDb = props.loadDbInstance;
    }

    async insertNewTag(payload: NewTag | NewTag[]) {
        const pa = Array.isArray(payload) ? payload : [payload];
        const db = TagsRepository.loadDb();
        // ignore the error below
        return await db?.insert(tagsTable).values(pa).returning({
            id: tagsTable.id,
            name: tagsTable.name,
            description: tagsTable.description,
        });
    }

    async linkTagToTransaction(payload: NewTransactionTag) {
        const db = TagsRepository.loadDb();
        // ignore the error below
        return await db
            ?.insert(transactionTagsTable)
            .values(payload)
            .returning({
                id: transactionTagsTable.id,
                tagId: transactionTagsTable.tagId,
                transactionId: transactionTagsTable.transactionId,
            });
    }

    async getAllUserTags(id: number) {
        const db = TagsRepository.loadDb();
        return await db
            ?.select()
            .from(tagsTable)
            .where(eq(tagsTable.userId, id))
            .leftJoin(
                transactionTagsTable,
                eq(tagsTable.id, transactionTagsTable.tagId)
            )
            .leftJoin(
                transactionsTable,
                eq(transactionTagsTable.transactionId, transactionsTable.id)
            );
    }

    async getTagById(userId: number, tagId: Array<number>) {
        const db = TagsRepository.loadDb();
        return await Promise.all(
            tagId.map(async (id) => {
                return await db
                    ?.select()
                    .from(tagsTable)
                    .where(
                        and(eq(tagsTable.userId, userId), eq(tagsTable.id, id))
                    )
                    .leftJoin(
                        transactionTagsTable,
                        eq(tagsTable.id, transactionTagsTable.tagId)
                    )
                    .leftJoin(
                        transactionsTable,
                        eq(
                            transactionTagsTable.transactionId,
                            transactionsTable.id
                        )
                    );
            })
        );
    }
}
