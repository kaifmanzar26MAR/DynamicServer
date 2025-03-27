const fs = require("fs");
const path = require("path");

function generateServer(configFile, outputFile) {
  const config = JSON.parse(fs.readFileSync(configFile, "utf-8"));

  let imports = `const express = require("express");\nconst cors = require("cors");\nconst app = express();\napp.use(cors({ origin: "*" }));\napp.use(express.json());\n\n`;

  let middlewares = ``;
  let routes = ``;
  let authRequiredRoutes = [];
  let adminRequiredRoutes = [];
  let logRequiredRoutes = [];
  const nodes = config.nodes;

  nodes.forEach((node) => {
    if (node.properties.type === "middleware") {
      if (node.properties.auth_required) {
        middlewares += `const authMiddleware = (req, res, next) => {\n  if (!req.headers.authorization) {\n    return res.status(401).json({ message: "Unauthorized" });\n  }\n  next();\n};\n\n`;
        authRequiredRoutes.push(...(Array.isArray(node.target) ? node.target : [node.target]));
      }
      if (node.properties.admin_required) {
        middlewares += `const adminMiddleware = (req, res, next) => {\n  if (req.headers.authorization !== "admin") {\n    return res.status(403).json({ message: "Forbidden" });\n  }\n  next();\n};\n\n`;
        adminRequiredRoutes.push(...(Array.isArray(node.target) ? node.target : [node.target]));
      }
      if (node.properties.log_requests) {
        middlewares += `const logMiddleware = (req, res, next) => {\n  console.log("Generating log..");  next();\n};\n\n`;
        logRequiredRoutes.push(...(Array.isArray(node.target) ? node.target : [node.target]));
      }
    }
  });

  nodes.forEach((node) => {
    if (node.properties.endpoint) {
      let middlewareStr = "";
      if (authRequiredRoutes.includes(node.id)) middlewareStr += "authMiddleware, ";
      if (adminRequiredRoutes.includes(node.id)) middlewareStr += "adminMiddleware, ";
      if (logRequiredRoutes.includes(node.id)) middlewareStr += "logMiddleware, ";
      
      routes += `app.${node.properties.method.toLowerCase()}("${node.properties.endpoint}", ${middlewareStr}(req, res) => {
  res.json({ message: "Response from ${node.name}" });
});\n\n`;
    }
  });

  const serverConfig = `${imports}${middlewares}${routes}app.listen(3000, () => console.log("Server running on port 3000"));`;

  fs.writeFileSync(outputFile, serverConfig, "utf-8");
  console.log(`Server file generated: ${outputFile}`);
  console.log(`run the following commands to run the server : `);
  console.log(`npm init -y`);
  console.log(`npm install express cors`);
  console.log(`node server.js`);
}

const configPath = path.join(__dirname, "server_config.json");
const outputPath = path.join(__dirname, "server.js");
generateServer(configPath, outputPath);
