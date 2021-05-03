const path = require("path");
const execFileSync = require("child_process").execFileSync;

const currentScriptDir = path.resolve(__dirname);

const SCRIPT_FILENAME = "deploy.js";
let OPTIONAL_ARGS = ["--network", "localhost"];

task("deploy", `Run the "${SCRIPT_FILENAME}" script`)
    // .addOptionalParam("docker", "The IP address of network like Docker network")
    .setAction(async (taskArguments) => {
        if (taskArguments.docker) {
            OPTIONAL_ARGS = ["--network", "docker"];
        }

        const SCRIPT_FILE_PATH = path.join(currentScriptDir, "..", "scripts", SCRIPT_FILENAME);
        console.log(`Running: \`npx hardhat run ${SCRIPT_FILE_PATH} ${OPTIONAL_ARGS.join(" ")}\``);

        execFileSync("npx", ["hardhat", "run", SCRIPT_FILE_PATH, ...OPTIONAL_ARGS], { stdio: "inherit" });

        console.log(`Finished running command`);
    });
