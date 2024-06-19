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

//The export below is rightfully imported in stark iff the code above is commented
//Otherwise the code above will be executed on running the index file in stark

//I think this file can be dedicated for imports and exports if hercules has to relate with the other packages in the monorepo
import { helloTraveller } from "./hello";


export default helloTraveller; 
