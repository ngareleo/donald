import {
    Connections,
    TagsRepository,
    TransactionsRepository,
    UserRepository,
} from "server-repository";
import { loadConfigs } from "~/config";

const cache: {
    userRepository: UserRepository | null;
    tagsRepository: TagsRepository | null;
    transactionsRepository: TransactionsRepository | null;
} = {
    userRepository: null,
    tagsRepository: null,
    transactionsRepository: null,
};
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

export function loadRepository() {
    const longLivedConnection = connection?.getLongLivedDBConnection();
    const { tagsRepository, userRepository, transactionsRepository } = cache;
    if (!tagsRepository) {
        cache.tagsRepository = new TagsRepository({
            loadDbInstance: () => longLivedConnection,
        });
    }
    if (!userRepository) {
        cache.userRepository = new UserRepository({
            loadDbInstance: () => longLivedConnection,
        });
    }
    if (!transactionsRepository) {
        cache.transactionsRepository = new TransactionsRepository({
            loadDbInstance: () => longLivedConnection,
        });
    }
    return {
        userRepository,
        tagsRepository,
        transactionsRepository,
    };
}
