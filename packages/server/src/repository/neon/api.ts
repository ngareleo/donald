import {
    type CreatedBranchResponse,
    type DeletedBranchResponse,
    type GetBranchesResponse,
    type NeonProject,
} from "./types";

const NEON_API_BASE_URL = "https://console.neon.tech/api/v2";
const NEON_TEST_BRANCH_ID = "br-late-base-a21oviy0";

export async function NeonAPIRequest(args: {
    method: "POST" | "GET" | "DELETE";
    url: string;
    apiKey: string;
    payload?: unknown;
    overrideHeaders?: { [key: string]: string };
}) {
    const headers = {
        accept: "application/json",
        authorization: `Bearer ${args.apiKey}`,
        "content-type": "application/json",
        ...args.overrideHeaders,
    };

    return await fetch(args.url, {
        body: JSON.stringify(args.payload),
        method: args.method,
        headers,
    });
}

export async function createNeonBranch(args: { id: string; apiKey: string }) {
    const { id, apiKey } = args;
    const url = `${NEON_API_BASE_URL}/projects/${id}/branches`;
    const res = await NeonAPIRequest({
        method: "POST",
        url,
        apiKey,
        payload: {
            branch: { parent_id: NEON_TEST_BRANCH_ID },
            endpoints: [{ type: "read_write" }],
        },
    });

    const resPayload = await res.json();
    if (res.status != 201 || !resPayload) {
        throw Error(resPayload);
    }

    return resPayload as CreatedBranchResponse;
}

export async function loadNeonProject(args: { apiKey: string }) {
    const url = `${NEON_API_BASE_URL}/projects`;
    const res = await NeonAPIRequest({
        method: "GET",
        url,
        apiKey: args.apiKey,
    });
    if (res.status !== 200) {
        throw Error(await res.text());
    }

    const resPayload = await res.json();

    if (!resPayload || !resPayload["projects"]) {
        throw Error(
            `❗️ Project payload lacks desired structure ${JSON.stringify(resPayload)}`,
        );
    }

    const [project] = resPayload["projects"] as Array<NeonProject>;
    // Good place to add an alert if it is in CI and project is missing
    return project;
}

export async function destroyNeonTestingBranchDB(args: {
    project: string;
    branch: string;
    apiKey: string;
}) {
    const url = `${NEON_API_BASE_URL}/projects/${args.project}/branches/${args.branch}`;
    const res = await NeonAPIRequest({
        method: "DELETE",
        url,
        apiKey: args.apiKey,
    });
    const payload = await res.json();

    if (res.status !== 200 || !payload) {
        console.error("delete branches", payload);
        throw Error(payload);
    }

    return payload as DeletedBranchResponse;
}

export async function getAllBranches(args: {
    project: string;
    apiKey: string;
}) {
    const url = `${NEON_API_BASE_URL}/projects/${args.project}/branches}`;

    const res = await NeonAPIRequest({
        method: "GET",
        url,
        apiKey: args.apiKey,
    });
    const payload = await res.json();

    if (res.status !== 200 || !payload) {
        console.error("get branches : ", payload);
        throw Error(payload);
    }

    return payload as GetBranchesResponse;
}
