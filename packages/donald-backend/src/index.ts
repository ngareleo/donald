import App from "./app";
import { loadConfigs } from "./config";

const config = loadConfigs();
const { processEnvironment, localDbURL } = config;

const startApplication = () => {
  if (processEnvironment === "dev" && !localDbURL) {
    console.error("❗️ Missing db configs");
    process.exit();
  }

  const application = App;
  application.listen(process.env.PORT || 3000);

  if (processEnvironment === "dev") {
    console.info(
      `📶 Elysia is running at http://${application.server?.hostname}:${application.server?.port}`,
    );
  }
};

startApplication();