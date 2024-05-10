import { eq } from "drizzle-orm";
import { getDatabaseInstance, usersTable, type NewUser } from "..";

export type PublicUser = Required<Omit<NewUser, "password">>;
export type FindUserResponse =
  | PublicUser
  | "something_went_wrong"
  | "user_not_found"
  | "incorrect_password";

const dbInstance = getDatabaseInstance();

export const insertUser = async (
  newUser: NewUser
): Promise<PublicUser | null> => {
  const hash = Bun.password.hashSync(newUser.password);
  const res = await dbInstance!
    .insert(usersTable)
    .values({ ...newUser, password: hash })
    .returning({
      id: usersTable.id,
      username: usersTable.username,
      email: usersTable.email,
      phoneNumber: usersTable.phoneNumber,
      dateAdded: usersTable.dateAdded,
      lastModified: usersTable.lastModified,
    });

  return res ? res[0] : null;
};

export const findUserByUsername = async (
  subject: string,
  usersPassword: string
): Promise<FindUserResponse> => {
  console.log(subject, usersPassword);

  const lookup = await dbInstance!
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

  if (!lookup) {
    return "something_went_wrong";
  } else if (lookup.length === 0) {
    return "user_not_found";
  } else if (!Bun.password.verifySync(usersPassword, lookup[0].password)) {
    return "incorrect_password";
  }
  const { password, ...publicUser } = lookup[0];
  return publicUser as PublicUser;
};

export const findUserById = async (id: number) => {
  const res = await dbInstance!
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
  if (!res || res.length === 0) {
    return null;
  }
  return res[0];
};

export const deleteUser = async (id: number) => {
  return await dbInstance!
    .delete(usersTable)
    .where(eq(usersTable.id, id))
    .returning();
};
