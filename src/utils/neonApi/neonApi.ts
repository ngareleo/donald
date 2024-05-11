import { NEON_API_BASE_URL } from "../constants";
import { DeletedDatabase, NeonDB, NeonProject } from "./types";

const NeonAPIRequest = async (args: {
  method: "post" | "get" | "delete";
  url: string;
  apiKey: string;
  payload?: string;
  overrideHeaders?: { [key: string]: string };
}) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${args.apiKey}`,
    ...args.overrideHeaders,
  };

  return await fetch(args.url, {
    body: JSON.stringify(args.payload),
    method: args.method,
    headers,
  });
};

export const makeNeonTestingBranchDB = async ({
  projectID,
  branchID,
  apiKey,
}: {
  projectID: string;
  branchID: string;
  apiKey: string;
}) => {
  const url = `${NEON_API_BASE_URL}/projects/${projectID}/branches/${branchID}/databases`;
  const res = await NeonAPIRequest({ method: "post", url, apiKey });

  if (res.status !== 200) {
    throw Error(await res.text());
  }
  return (await res.json()) as NeonDB;
};

export const loadNeonProject = async ({ apiKey }: { apiKey: string }) => {
  const url = `${NEON_API_BASE_URL}/projects`;
  const res = await NeonAPIRequest({ method: "get", url, apiKey });

  if (res.status !== 200) {
    throw Error(await res.text());
  }

  const [project] = (await res.json()) as Array<NeonProject>;
  // Good place to add an alert if it is in CI and project is missing
  return project;
};

export const destroyNeonTestingBranchDB = async ({
  projectID,
  branchID,
  apiKey,
  dbName,
}: {
  projectID: string;
  branchID: string;
  apiKey: string;
  dbName: string;
}) => {
  const url = `${NEON_API_BASE_URL}/projects/${projectID}/branches/${branchID}/databases/${dbName}`;
  const res = await NeonAPIRequest({ method: "delete", url, apiKey });

  if (res.status !== 200) {
    throw Error(await res.text());
  }
  return (await res.json()) as DeletedDatabase;
};
