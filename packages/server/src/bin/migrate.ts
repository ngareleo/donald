import { Connections } from "server-repository";
import { loadConfigs } from "~/config";

(async () => {
    // Todo: We are loading too many unused variables.
    const {
        processEnvironment,
        localDbURL,
        testingDbURL,
        migrationsFolder,
        verbose,
    } = loadConfigs();

    const connection = new Connections({
        loadConfig: () => {
            return {
                processEnvironment,
                shortLivedDbUrl: testingDbURL,
                longLivedDbUrl: localDbURL,
                migrationsFolder,
                verbose,
            };
        },
    });

    await connection?.getLongLivedDBConnection().migrate();
})();
