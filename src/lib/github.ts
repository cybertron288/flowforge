import { Octokit } from '@octokit/rest';
import { getRequiredInputsFromGitHubAction } from "./yaml";

const octokit = new Octokit(
    process.env.GITHUB_TOKEN
        ? { auth: process.env.GITHUB_TOKEN }
        : undefined
);

export interface WorkflowInput {
    name: string;
    description?: string;
    required: boolean;
    default?: string;
    type: string;
}

export interface GitHubWorkflow {
    name: string;
    path: string;
    state: string;
    id: number;
    inputs?: Record<string, WorkflowInput>;
}

export interface GitHubAction {
    id: string;
    name: string;
    description: string;
    owner: string;
    repo: string;
    path?: string;
}

export interface GitHubActionRepo {
    id: number;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    owner: {
        login: string;
        avatar_url: string;
    };
    topics: string[];
    stargazers_count: number;
}

export async function searchGitHubActions(query: string): Promise<GitHubAction[]> {
    if (!query || query.length < 2) return [];

    try {
        // Search for actions in the GitHub Marketplace
        const searchQuery = `${query} in:file filename:action.yml path:/`;
        const response = await octokit.rest.search.code({
            q: searchQuery,
            per_page: 10,
        });

        return response.data.items.map(item => ({
            id: `${item.repository.owner.login}/${item.repository.name}`,
            name: item.repository.name,
            description: item.repository.description || '',
            owner: item.repository.owner.login,
            repo: item.repository.name,
            path: item.path,
        }));
    } catch (error) {
        console.error('Error searching actions:', error);
        return [];
    }
}

// export async function searchGitHubActionsRepos(
//     query: string = '',
//     sort: 'stars' | 'updated' | 'best-match' = 'best-match',
//     perPage: number = 30,
//     page: number = 1
// ): Promise<GitHubActionRepo[]> {
//     try {
//         // Construct search query with actions topic
//         const searchQuery = `topic:github-actions ${query}`;

//         const response = await octokit.rest.search.repos({
//             q: searchQuery,
//             sort,
//             per_page: perPage,
//             page,
//         });

//         return response.data.items.map(repo => ({
//             id: repo.id,
//             name: repo.name,
//             full_name: repo.full_name,
//             description: repo.description || '',
//             html_url: repo.html_url,
//             created_at: repo.created_at,
//             updated_at: repo.updated_at,
//             owner: {
//                 login: repo.owner.login,
//                 avatar_url: repo.owner.avatar_url,
//             },
//             topics: repo.topics || [],
//             stargazers_count: repo.stargazers_count,
//         }));
//     } catch (error) {
//         console.error('Error searching GitHub actions:', error);
//         throw error;
//     }
// }

export async function getRepositoryWorkflows(owner: string, repo: string): Promise<GitHubWorkflow[]> {
    try {
        const { data } = await octokit.actions.listRepoWorkflows({
            owner,
            repo,
        });

        const workflows = await Promise.all(
            data.workflows.map(async (workflow) => {
                const content = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner,
                    repo,
                    path: workflow.path,
                });

                const yaml = Buffer.from(content.data.content, 'base64').toString();
                const inputs = parseWorkflowInputs(yaml);

                return {
                    name: workflow.name,
                    path: workflow.path,
                    state: workflow.state,
                    id: workflow.id,
                    inputs,
                };
            })
        );

        return workflows;
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return [];
    }
}

function parseWorkflowInputs(yaml: string): Record<string, WorkflowInput> {
    const inputs: Record<string, WorkflowInput> = {};
    const matches = yaml.match(/on:\s*workflow_dispatch:\s*inputs:([\s\S]*?)(?=\n\w|$)/);

    if (matches && matches[1]) {
        const inputsSection = matches[1];
        const inputMatches = inputsSection.matchAll(/(\w+):\s*(?:{([^}]+)}|([\s\S]*?)(?=\n\s*\w+:|$))/g);

        for (const match of inputMatches) {
            const [, name, inlineProps, multilineProps] = match;
            const props = inlineProps || multilineProps;

            if (props) {
                const description = props.match(/description:\s*['"]?(.*?)['"]?(?:\n|$)/)?.[1];
                const required = /required:\s*true/.test(props);
                const defaultValue = props.match(/default:\s*['"]?(.*?)['"]?(?:\n|$)/)?.[1];
                const type = props.match(/type:\s*['"]?(.*?)['"]?(?:\n|$)/)?.[1] || 'string';

                inputs[name] = {
                    name,
                    description,
                    required,
                    default: defaultValue,
                    type,
                };
            }
        }
    }

    return inputs;
}

export async function getActionYAMLInputs(owner: string, repo: string, path: string): Promise<string> {
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        console.log('response', response.data)


        const actionFile = response.data.find((file) => file.name === "action.yml");

        console.log("actionFile", actionFile)

        let content = null;

        if (actionFile && actionFile.download_url) {
            const response = await fetch(actionFile.download_url);
            if (response.ok) {
                content = await response.text();
            } else {
                console.error("Failed to fetch the file content");
            }
        }

        const yamlInput = getRequiredInputsFromGitHubAction(content);

        return yamlInput;

    } catch (error) {
        console.error('Error fetching YAML content:', error);
        return '';
    }
}