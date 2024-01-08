import { eq, or } from "drizzle-orm";
import { db } from "../db/index.db";
import { NewUser, user } from "../db/schema.db";

type PublicUser = Required<Omit<NewUser, "password">>;

export const insertUser = async (
  newUser: NewUser
): Promise<PublicUser | null> => {
  const hash = Bun.password.hashSync(newUser.password);
  const res = await db
    .insert(user)
    .values({ ...newUser, password: hash })
    .returning({
      id: user.id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dateAdded: user.dateAdded,
      lastModified: user.lastModified,
    })
    .catch((err) => {
      console.error(err);
    });

  return res ? res[0] : null;
};

export const findUserByUsernameEmailOrPhone = async (
  subject: string,
  _password: string
): Promise<PublicUser | null> => {
  const lookup = await db
    .select()
    .from(user)
    .where(
      or(
        eq(user.username, subject),
        eq(user.email, subject),
        eq(user.phoneNumber, subject)
      )
    ); // should not return more than one user

  if (!lookup || !Bun.password.verifySync(_password, lookup[0].password)) {
    return null;
  }
  const { password, ...publicUser } = lookup[0];
  return publicUser as PublicUser;
};

export const findUserById = async (id: number): Promise<PublicUser | null> => {
  const res = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .catch((err) => {
      console.error(err);
    });

  if (res != null && res.length > 0) {
    const { password, ...publicUser } = res[0];
    return publicUser as PublicUser;
  }

  return null;
};
