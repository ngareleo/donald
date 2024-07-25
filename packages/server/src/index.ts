import {
    Connections,
    TagsRepository,
    TransactionsRepository,
    UserRepository,
} from "server-repository";
import App from "./app";
import { loadConfigs } from "./config";

const startApplication = () => {
    // load configs for the application (dev and prod)
    const {
        processEnvironment,
        localDbURL,
        testingDbURL,
        migrationsFolder,
        verbose,
    } = loadConfigs();

    // warmup the connections manager
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

    // warmup the repositories

    new UserRepository({
        loadDbInstance: () => connection.getLongLivedDBConnection().value,
    });
    new TagsRepository({
        loadDbInstance: () => connection.getLongLivedDBConnection().value,
    });
    new TransactionsRepository({
        loadDbInstance: () => connection.getLongLivedDBConnection().value,
    });

    // checks to avoid leaking secrets unnecessary

    // boot application
    if (processEnvironment === "dev" && !localDbURL) {
        console.error("❗️ Missing db configs");
        process.exit();
    }

    const application = App;
    application.listen(process.env.PORT || 3000);

    if (processEnvironment === "dev") {
        console.info(
            `📶 Elysia is running at http://${application.server?.hostname}:${application.server?.port}`
        );
    }
};

startApplication();
