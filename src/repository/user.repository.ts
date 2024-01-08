import { eq, or } from "drizzle-orm";

import { db } from "../db/index.db";
import type { NewUser } from "../db/schema.db";
import { usersTable } from "../db/schema.db";

type PublicUser = Required<Omit<NewUser, "password">>;

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

export const findUserByUsernameEmailOrPhone = async (
  subject: string,
  usersPassword: string
): Promise<PublicUser | null> => {
  // TODO: Add fix for multiple users with same username, email or phone number

  const lookup = await db
    .select()
    .from(usersTable)
    .where(
      or(
        eq(usersTable.username, subject),
        eq(usersTable.email, subject),
        eq(usersTable.phoneNumber, subject)
      )
    ); // should not return more than one user

  if (
    !lookup ||
    lookup.length === 0 ||
    !Bun.password.verifySync(usersPassword, lookup[0].password)
  ) {
    return null;
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
