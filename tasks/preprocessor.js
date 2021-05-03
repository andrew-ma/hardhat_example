const path = require("path");
const fs = require("fs");
const execFileSync = require("child_process").execFileSync;

const currentScriptDir = path.resolve(__dirname);
const processed_dir = path.join(currentScriptDir, "..", "processed_contracts");
const defs_json_filepath = path.join(currentScriptDir, "..", "contracts", "defs.json");

task("preprocessor", "Run flatten task with result passed through preprocessor command and saved as file 'output.txt'")
    .addVariadicPositionalParam("files", "Solidity contract files to be flattened")
    .setAction(async (taskArguments) => {
        if (!fs.existsSync(processed_dir)) {
            fs.mkdirSync(processed_dir);
        }

        console.log(`Running: \`npx solpp --defs ${defs_json_filepath} ` + taskArguments.files.map((x) => `"${x}"`).join(" ") + "`");

        const preProcessorStdout = execFileSync("npx", ["solpp", "--defs", defs_json_filepath, taskArguments.files[0]]);

        // write buffer to file
        // console.log(preProcessorStdout.toString());
        const preProcessedFilename = path.join(processed_dir, "temp_" + path.basename(taskArguments.files[0]));
        fs.writeFileSync(preProcessedFilename, preProcessorStdout);

        ////////////////////////////////////////////////////////////////////////

        // Run through output script
        const bashScriptFilename = path.join(currentScriptDir, "output_task.sh");
        console.log(`Running: \`${bashScriptFilename} ` + preProcessedFilename + "`");

        const outputScriptStdout = execFileSync(bashScriptFilename, [preProcessedFilename]);
        // console.log(outputScriptStdout.toString());

        const outputProcessedFilename = path.join(processed_dir, path.basename(taskArguments.files[0]));
        // write buffer to file and overwrite processed_contracts
        fs.writeFileSync(outputProcessedFilename, outputScriptStdout);

        // delete the file that was before the output script
        fs.unlinkSync(preProcessedFilename);

        console.log(`Finished running command`);
    });
