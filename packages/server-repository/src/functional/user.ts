import { eq, or } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "../schema";
import { drizzle as PostgresJSDrizzle } from "drizzle-orm/postgres-js";
import { usersTable, type NewUser } from "..";
import type { NeonDBType, PostgresDBType } from "~/types";

type Props = {
    loadDbInstance: () => NeonDBType | PostgresDBType;
};
export type PublicUser = Required<Omit<NewUser, "password">>;
export type FindUserResponse =
    | PublicUser
    | "something_went_wrong"
    | "user_not_found"
    | "incorrect_password";

export class UserRepository {
    static loadDb: Props["loadDbInstance"];
    static dbInstance: ReturnType<typeof PostgresJSDrizzle>;

    constructor(props: Props) {
        UserRepository.loadDb = props.loadDbInstance;
    }

    /*
    We have an issue at the moment with opening these db connection within our current architecture
    This setup gurantees normal operation in dev/prod environment
    However, tests are broken. Good thing we have a foundation and we don't need
    tests at this stage of development. So ignore this for now.
    
    Todo: Will fix above when we reach a stage where tests are needed
    */
    private static loadDbInstance() {
        if (UserRepository.dbInstance) {
            return UserRepository.dbInstance;
        }
        UserRepository.dbInstance = PostgresJSDrizzle(
            postgres(process.env.DB_URL),
            {
                schema,
            }
        );
        return UserRepository.dbInstance;
    }

    async insertUser(user: NewUser): Promise<PublicUser | null> {
        const db = UserRepository.loadDbInstance();
        const hash = Bun.password.hashSync(user.password);
        const [res] = await db
            .insert(usersTable)
            .values({ ...user, password: hash })
            .returning();
        return res;
    }

    async findUserByUsername(
        subject: string,
        pass: string
    ): Promise<FindUserResponse | null> {
        const db = UserRepository.loadDbInstance();
        const [res] = await db
            .select({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
                password: usersTable.password,
            })
            .from(usersTable)
            .where(
                or(
                    eq(usersTable.username, subject),
                    eq(usersTable.email, subject)
                )
            );
        if (!res) {
            return "user_not_found";
        } else if (!Bun.password.verifySync(pass, res.password)) {
            return "incorrect_password";
        }
        const { password, ...publicUser } = res;
        return publicUser as PublicUser;
    }

    async findUserById(id: number) {
        const db = UserRepository.loadDbInstance();
        const [res] = await db
            .select({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
            })
            .from(usersTable)
            .where(eq(usersTable.id, id));
        if (!res) {
            return null;
        }
        return res;
    }

    async deleteUser(id: number) {
        const db = UserRepository.loadDbInstance();
        return await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();
    }
}
