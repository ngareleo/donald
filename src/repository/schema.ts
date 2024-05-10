import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core";

const defaultFields = {
  id: serial("id").primaryKey(),
  dateAdded: timestamp("date_added").notNull().defaultNow(),
  lastModified: timestamp("last_modified").notNull().defaultNow(),
};

export const transactionTypeTable = pgTable("transaction_type", {
  ...defaultFields,
  description: text("description").unique().notNull(),
  name: text("name").unique().notNull(),
});

export const transactionsTable = pgTable("transaction", {
  ...defaultFields,
  agentNumber: text("agent_number"),
  balance: integer("balance"),
  dateTime: timestamp("date_time").notNull(),
  interest: integer("interest").default(0), // in cents
  location: text("location"),
  messageId: integer("source_message_id").notNull(),
  subject: text("subject").notNull(),
  subjectAccount: text("subject_account"),
  subjectPhoneNumber: text("subject_phone_number"),
  transactionAmount: integer("transaction_amount").notNull(), // in cents
  transactionCode: text("transaction_code").unique().notNull(),
  transactionCost: integer("transaction_cost").default(0), // in cents
  type: integer("type")
    .references(() => transactionTypeTable.id)
    .notNull(),
  userId: integer("user_id").references(() => usersTable.id),
});

export const usersTable = pgTable("user", {
  ...defaultFields,
  email: text("email").unique().notNull(),
  password: text("password").unique().notNull(),
  phoneNumber: text("phone_number").unique(),
  username: text("username").unique().notNull(),
});

export const tagsTable = pgTable("tags", {
  ...defaultFields,
  description: text("description"),
  name: text("name").notNull(),
  userId: integer("user_id").references(() => usersTable.id),
});

export const transactionTagsTable = pgTable("transaction_tags_table", {
  ...defaultFields,
  tagId: integer("tag_id").references(() => tagsTable.id),
  transactionId: integer("transaction_id").references(
    () => transactionsTable.id
  ),
});

export type NewTag = typeof tagsTable.$inferInsert;
export type NewTransaction = typeof transactionsTable.$inferInsert;
export type NewTransactionTag = typeof transactionTagsTable.$inferInsert;
export type NewUser = typeof usersTable.$inferInsert;
export type NewTransactionType = typeof transactionTypeTable.$inferInsert;
