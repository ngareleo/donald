import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core";

const defaultFields = {
  id: serial("id").primaryKey(),
  dateAdded: timestamp("date_added").defaultNow(),
  lastModified: timestamp("last_modified").defaultNow(),
};

export const usersTable = pgTable("user", {
  ...defaultFields,
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  phoneNumber: text("phone_number").unique(),
  password: text("password").unique().notNull(),
});

export type NewUser = typeof usersTable.$inferInsert;

export const transactionTypeTable = pgTable("transaction_type", {
  ...defaultFields,
  name: text("name").unique().notNull(),
  description: text("description").unique().notNull(),
});

export const transactionsTable = pgTable("transaction", {
  ...defaultFields,
  type: integer("type")
    .references(() => transactionTypeTable.id)
    .notNull(),
  messageId: integer("source_message_id").notNull(),
  transactionCode: text("transaction_code").unique().notNull(),
  transactionAmount: integer("transaction_amount").notNull(), // in cents
  subject: text("subject").notNull(),
  subjectPhoneNumber: text("subject_phone_number"),
  subjectAccount: text("subject_account"),
  dateTime: timestamp("date_time").notNull(),
  balance: integer("balance"),
  transactionCost: integer("transaction_cost").default(0), // in cents
  location: text("location"),
  interest: integer("interest").default(0), // in cents
  agentNumber: text("agent_number"),
  userId: integer("user_id").references(() => usersTable.id),
});

export type NewTransaction = typeof transactionsTable.$inferInsert;
