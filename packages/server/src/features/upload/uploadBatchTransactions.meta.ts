import { t } from "elysia";

export const ClientSideTransactionDTO = t.Object({
    agentNumber: t.Optional(t.String()),
    balance: t.String(),
    dateTime: t.String(),
    interest: t.Optional(t.String()),
    location: t.Optional(t.String()),
    messageId: t.String(),
    subject: t.String(),
    subjectAccount: t.Optional(t.String()),
    subjectPhoneNumber: t.Optional(t.String()),
    transactionAmount: t.String(),
    transactionCode: t.String(),
    transactionCost: t.String(),
    type: t.String(),
});

export const IncomingTransactionPayloadDTO = t.Object({
    raw: t.Array(ClientSideTransactionDTO),
});
