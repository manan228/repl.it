import express from "express";
import fs from "fs";
import yaml from "yaml";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import {
  KubeConfig,
  AppsV1Api,
  CoreV1Api,
  NetworkingV1Api,
} from "@kubernetes/client-node";

const app = express();
app.use(express.json());
app.use(cors());

const kubeconfig = new KubeConfig();
const configFilePath = "../config.yaml";
kubeconfig.loadFromFile(configFilePath);
const coreV1Api = kubeconfig.makeApiClient(CoreV1Api);
const appsV1Api = kubeconfig.makeApiClient(AppsV1Api);
const networkingV1Api = kubeconfig.makeApiClient(NetworkingV1Api);

const readAndParseKubeYaml = (filePath: string, replId: string): Array<any> => {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const docs = yaml.parseAllDocuments(fileContent).map((doc) => {
    let docString = doc.toString();
    
    const regex = new RegExp(`service_name`, "g");
    const regex_aws_accessKey = new RegExp(`ACCESS_KEY_AWS`, "g");
    const regex_aws_secret_accessKey = new RegExp(`AWS_ACCESS_KEY_SECRET`, "g");
    
    docString = docString.replace(regex, replId);
    docString = docString.replace(
      regex_aws_accessKey,
      (process.env.AWS_ACCESS_KEY_ID)?.toString() ?? ""
    );
    docString = docString.replace(
      regex_aws_secret_accessKey,
      (process.env.AWS_SECRET_ACCESS_KEY)?.toString() ?? ""
    );

    return yaml.parse(docString);
  });
  return docs;
};

app.post("/start", async (req, res) => {
  const { replId } = req.body;
  const namespace = "default";

  try {
    const kubeManifests = readAndParseKubeYaml(
      path.join(__dirname, "../service.yaml"),
      replId
    );
    for (const manifest of kubeManifests) {
      switch (manifest.kind) {
        case "Deployment":
          await appsV1Api.createNamespacedDeployment(namespace, manifest);
          break;
        case "Service":
          await coreV1Api.createNamespacedService(namespace, manifest);
          break;
        case "Ingress":
          await networkingV1Api.createNamespacedIngress(namespace, manifest);
          break;
        default:
          console.log(`Unsupported kind: ${manifest.kind}`);
      }
    }
    res.status(200).send({ message: "Resources created successfully" });
  } catch (error) {
    console.error("Failed to create resources", error);
    res.status(500).send({ message: "Failed to create resources" });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
