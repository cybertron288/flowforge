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

// Helper to generate workflow
export const generateWorkflowFromData = (data) => {
    const { nodes, edges } = data;

    // Create a map of nodes by their IDs for easy lookup
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Get the ordered steps based on edges
    const getOrderedSteps = () => {
        const visited = new Set();
        const steps = [];

        const traverse = (nodeId) => {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);

            const node = nodeMap.get(nodeId);
            if (node) {
                const action = {
                    name: node.data.name || `Step for ${node.id}`,
                    uses: `${node.data.externalUsesPathPrefix || './'}${node.data.slug}`,
                };

                if (node.data.actionInputs) {
                    action.with = Object.fromEntries(
                        Object.entries(node.data.actionInputs).map(([key, value]) => [
                            key,
                            value.default || `\${{ inputs.${key} }}`,
                        ])
                    );
                }

                steps.push(action);

                edges
                    .filter((edge) => edge.source === nodeId)
                    .forEach((edge) => traverse(edge.target));
            }
        };

        // Find root nodes (those not targeted by any edge)
        const rootNodes = nodes.filter(
            (node) => !edges.some((edge) => edge.target === node.id)
        );

        rootNodes.forEach((root) => traverse(root.id));

        return steps;
    };

    const orderedSteps = getOrderedSteps();

    // Generate the workflow YAML structure
    const workflow = {
        name: 'Generated Workflow',
        on: {
            push: {
                branches: ['main'], // Customize based on requirements
            },
        },
        jobs: {
            build: {
                'runs-on': 'ubuntu-latest',
                steps: orderedSteps,
            },
        },
    };

    return yaml.stringify(workflow);
};