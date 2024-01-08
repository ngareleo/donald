import { eq, or } from "drizzle-orm";
import { db } from "../db";
import { NewUser, user } from "../db/schema";

type PublicUser = Required<Omit<NewUser, "password">>;

export const insertUser = async (
  newUser: NewUser
): Promise<PublicUser | null> => {
  const res = await db
    .insert(user)
    .values(newUser)
    .returning()
    .catch((err) => {
      console.error(err);
    });

  if (res != null && res.length > 0) {
    const publicUsers = res.map((user) => {
      const { password, ...publicUser } = user;
      return publicUser as PublicUser;
    });

    return publicUsers[0];
  }

  return null;
};

export const findUserByUsernameEmailOrPhone = async (
  subject: string,
  _password: string
): Promise<PublicUser | null> => {
  const res = await db
    .select()
    .from(user)
    .where(
      or(
        eq(user.username, subject),
        eq(user.email, subject),
        eq(user.phoneNumber, subject)
      )
    )
    .catch((err) => {
      console.error(err);
    });

  if (res != null && res.length > 0) {
    const actualUser = res.filter((u) => {
      return Bun.password.verify(_password, u.password);
    });
    const { password, ...publicUser } = actualUser[0];
    return publicUser as PublicUser;
  }

  return null;
};
