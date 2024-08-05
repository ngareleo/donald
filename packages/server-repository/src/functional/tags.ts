import { and, eq } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../schema";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
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

    static dbInstance: ReturnType<typeof PostgresJSDrizzle>;

    constructor(props: Props) {
        TagsRepository.loadDb = props.loadDbInstance;
    }

    /*
    We have an issue at the moment with opening these db connection within our current architecture
    This setup gurantees normal operation in dev/prod environment
    However, tests are broken. Good thing we have a foundation and we don't need
    tests at this stage of development. So ignore this for now.
    
    Todo: Will fix above when we reach a stage where tests are needed
    */
    private static loadDbInstance() {
        if (TagsRepository.dbInstance) {
            return TagsRepository.dbInstance;
        }
        TagsRepository.dbInstance = PostgresJSDrizzle(
            postgres(process.env.DB_URL),
            {
                schema,
            }
        );
        return TagsRepository.dbInstance;
    }

    async insertNewTag(payload: NewTag | NewTag[]) {
        const pa = Array.isArray(payload) ? payload : [payload];
        const db = TagsRepository.loadDbInstance();
        // ignore the error below
        return await db?.insert(tagsTable).values(pa).returning({
            id: tagsTable.id,
            name: tagsTable.name,
            description: tagsTable.description,
        });
    }

    async linkTagToTransaction(payload: NewTransactionTag) {
        const db = TagsRepository.loadDbInstance();
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
        const db = TagsRepository.loadDbInstance();
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
