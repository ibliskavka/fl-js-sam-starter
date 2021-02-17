const fs = require("fs");

const packageFile = "package.json";
const packageContents = fs.readFileSync(packageFile).toString();
const package = JSON.parse(packageContents);

const configFile = "public/config.json";
const configContents = fs.readFileSync(configFile).toString();
const config = JSON.parse(configContents);

console.log("Updating build time and version");
config.buildTime = new Date().getTime();
config.version = package.version;

fs.writeFileSync(configFile, JSON.stringify(config, null, "    "));
