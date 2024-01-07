import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: serial("full_name").notNull(),
  dateAdded: timestamp("date_added").defaultNow(),
  lastModified: timestamp("last_modified").defaultNow(),
});
