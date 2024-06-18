import {
  NeonDBType,
  NewTransactionType,
  PostgresDBType,
  transactionTypeTable,
} from "..";

export async function seedTransactionTypes(
  dbInstance: NeonDBType | PostgresDBType,
) {
  await dbInstance
    .insert(transactionTypeTable)
    .values(seedTransactionTypesValues);
  console.info("🌱 Transaction types seeded");
}

/** Do not modify. It never changes in Prod unless you want to change. Order matters too */
const seedTransactionTypesValues: NewTransactionType[] = [
  {
    description: "For Deposit money MPESA transactions",
    name: "deposit",
  },
  {
    description: "For Withdraw money MPESA transactions",
    name: "withdraw",
  },
  {
    description: "send",
    name: "For Send money MPESA transactions",
  },
  {
    description: "For Receive money MPESA transactions",
    name: "receive",
  },
  {
    description: "For Paybill money MPESA transactions",
    name: "paybill",
  },
  {
    description: "For Buygoods money MPESA transactions",
    name: "buygoods",
  },
  {
    description: "For Airtime money MPESA transactions",
    name: "airtime",
  },
  {
    description: "For Fuliza MPESA transactions",
    name: "fuliza",
  },
  {
    description: "For Airtime money for other phone number MPESA transactions",
    name: "airtime_for",
  },
  {
    description: "For Invalid money MPESA transactions",
    name: "invalid",
  },
];
