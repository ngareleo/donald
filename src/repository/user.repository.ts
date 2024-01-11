import { eq, or } from "drizzle-orm";

import { db } from "../db/index.db";
import type { NewUser } from "../db/schema.db";
import { usersTable } from "../db/schema.db";

type PublicUser = Required<Omit<NewUser, "password">>;
type FindUserResponse =
  | PublicUser
  | "something_went_wrong"
  | "user_not_found"
  | "incorrect_password";

export const insertUser = async (
  newUser: NewUser
): Promise<PublicUser | null> => {
  const hash = Bun.password.hashSync(newUser.password);
  const res = await db
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

  const lookup = await db
    .select()
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

export const findUserById = async (id: number): Promise<PublicUser | null> => {
  const res = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (res != null && res.length > 0) {
    const { password, ...publicUser } = res[0];
    return publicUser as PublicUser;
  }

  return null;
};
