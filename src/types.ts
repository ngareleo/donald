// Single source of truth for all types we define for our MVC

export type DefaultTransaction = Required<
  Readonly<{
    balance: number;
    dateTime: string;
    messageId: string;
    subject: string;
    transactionAmount: number;
    transactionCode: string;
    transactionCost: number;
  }>
>;

export type AirtimeForTransaction = DefaultTransaction &
  Required<
    Readonly<{
      type: "airtime";
    }>
  >;

export type AirtimeTransaction = DefaultTransaction &
  Required<
    Readonly<{
      type: "airtime";
    }>
  >;

export type DepositTransaction = DefaultTransaction &
  Required<
    Readonly<{
      type: "deposit";
    }>
  >;

export type FulizaTransaction = DefaultTransaction &
  Required<
    Readonly<{
      interest: number;
      type: "fuliza";
    }>
  >;

export type LipaNaMpesaTransaction = DefaultTransaction &
  Required<
    Readonly<{
      type: "lipa_na_mpesa";
    }>
  >;

export type PaybillTransaction = DefaultTransaction &
  Required<
    Readonly<{
      subjectAccount: string;
      type: "paybill";
    }>
  >;

export type ReceiveMoneyTransaction = DefaultTransaction &
  Required<
    Readonly<{
      subjectPhoneNumber: string;
      type: "receive_money";
    }>
  >;

export type SendMoneyTransaction = DefaultTransaction &
  Required<
    Readonly<{
      subjectPhoneNumber: string;
      type: "send_money";
    }>
  >;

export type WithdrawTransaction = DefaultTransaction &
  Required<
    Readonly<{
      agentNumber: string;
      location: string;
      type: "withdraw";
    }>
  >;

export type Transaction =
  | AirtimeTransaction
  | DepositTransaction
  | FulizaTransaction
  | LipaNaMpesaTransaction
  | PaybillTransaction
  | ReceiveMoneyTransaction
  | SendMoneyTransaction
  | WithdrawTransaction;

/**The environment of the current running process. Its controlled by env variables */
export type Environment = "production" | "development" | "testing";

export type EnvVars = "prod" | "dev" | "test";
