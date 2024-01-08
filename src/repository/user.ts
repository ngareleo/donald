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
