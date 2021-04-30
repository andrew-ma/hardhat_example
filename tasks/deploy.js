const path = require("path");
const execFileSync = require("child_process").execFileSync;

const currentScriptDir = path.resolve(__dirname);

const SCRIPT_FILENAME = "deploy.js";
const OPTIONAL_ARGS = ["--network", "localhost"];

task("deploy", `Run the "${SCRIPT_FILENAME}" script`).setAction(async () => {
    const SCRIPT_FILE_PATH = path.join(currentScriptDir, "..", "scripts", SCRIPT_FILENAME);
    console.log(`Running: \`npx hardhat run ${SCRIPT_FILE_PATH} ${OPTIONAL_ARGS.join(" ")}\``);

    execFileSync("npx", ["hardhat", "run", SCRIPT_FILE_PATH, ...OPTIONAL_ARGS]);

    console.log(`Finished running command`);
});
