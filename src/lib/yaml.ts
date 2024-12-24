import fs from 'fs';
import yaml from 'yaml';

export function getRequiredInputsFromGitHubAction(fileContent) {
    try {
        // Read and parse the YAML file
        // const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsedYaml = yaml.parse(fileContent);

        // Check for `inputs` under `on.workflow_call`
        const inputs = parsedYaml?.inputs;
        if (!inputs) {
            console.log('No inputs found in the workflow file.');
            return [];
        }

        return inputs;
    } catch (error) {
        console.error('Error reading or parsing the YAML file:', error.message);
        return [];
    }
}
