import { eq } from "drizzle-orm";
import { getDatabaseInstance, usersTable, type NewUser } from "..";

export type PublicUser = Required<Omit<NewUser, "password">>;
export type FindUserResponse =
  | PublicUser
  | "something_went_wrong"
  | "user_not_found"
  | "incorrect_password";

export async function insertUser(user: NewUser): Promise<PublicUser | null> {
  const db = getDatabaseInstance();
  const hash = Bun.password.hashSync(user.password);
  const [res] = await db
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

export async function findUserByUsername(
  subject: string,
  pass: string,
): Promise<FindUserResponse> {
  const db = getDatabaseInstance();
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

export async function findUserById(id: number) {
  const db = getDatabaseInstance();
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

export async function deleteUser(id: number) {
  const db = getDatabaseInstance();
  return await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
}
