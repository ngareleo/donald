import { eq } from "drizzle-orm";
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

    constructor(props: Props) {
        UserRepository.loadDb = props.loadDbInstance;
    }

    async insertUser(user: NewUser): Promise<PublicUser | null> {
        const instance = UserRepository.loadDb();
        const hash = Bun.password.hashSync(user.password);
        const [res] = await instance
            .insert(usersTable)
            .values({ ...user, password: hash })
            .returning({
                id: usersTable.id,
                username: usersTable.username,
                email: usersTable.email,
                phoneNumber: usersTable.phoneNumber,
                dateAdded: usersTable.dateAdded,
                lastModified: usersTable.lastModified,
            });
        return res;
    }

    async findUserByUsername(
        subject: string,
        pass: string
    ): Promise<FindUserResponse> {
        const db = UserRepository.loadDb();
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
            .where(eq(usersTable.username, subject)); // should not return more than one user
        if (!res) {
            return "user_not_found";
        } else if (!Bun.password.verifySync(pass, res.password)) {
            return "incorrect_password";
        }
        const { password, ...publicUser } = res;
        return publicUser as PublicUser;
    }

    async findUserById(id: number) {
        const db = UserRepository.loadDb();
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
        const db = UserRepository.loadDb();
        return await db
            .delete(usersTable)
            .where(eq(usersTable.id, id))
            .returning();
    }
}
