const path = require("path");
const execFileSync = require("child_process").execFileSync;

const currentScriptDir = path.resolve(__dirname);

task("output", "Run flatten task with result passed through bash script and saved as file 'output.txt'")
    .addVariadicPositionalParam("files", "Solidity contract files to be flattened")
    .setAction(async (taskArguments) => {
        const bashScriptFilename = path.join(currentScriptDir, "output_task.sh");
        console.log(`Running: \`${bashScriptFilename} ` + taskArguments.files.map((x) => `"${x}"`).join(" ") + "`");

        execFileSync(bashScriptFilename, [...taskArguments.files], { stdio: "inherit" });

        console.log(`Finished running command`);
    });
