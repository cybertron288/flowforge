import { Octokit } from '@octokit/rest';

import { getRequiredInputsFromGitHubAction } from "@/lib/yaml";


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

const octokit = new Octokit(
    process.env.GITHUB_TOKEN
        ? { auth: process.env.GITHUB_TOKEN }
        : undefined
);

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


export async function getLatestVersion(repoUrl: string): Promise<string> {
    try {
        // Parse the repository URL
        const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
        if (!match) {
            throw new Error("Invalid repository URL. Use the format 'https://github.com/owner/repo'.");
        }

        const [, owner, repo] = match;

        // Step 1: Fetch all tags
        const tagsResponse = await octokit.rest.repos.listTags({
            owner,
            repo,
            per_page: 100,
        });

        if (tagsResponse.data.length > 0) {
            // Sort tags (assumes semantic versioning) and return the latest
            const latestTag = tagsResponse.data.sort((a, b) =>
                b.name.localeCompare(a.name, undefined, { numeric: true })
            )[0];
            return latestTag.name;
        }

        // Step 2: Fetch releases if no tags are found
        const releasesResponse = await octokit.rest.repos.listReleases({
            owner,
            repo,
            per_page: 100,
        });

        if (releasesResponse.data.length > 0) {
            // Find the latest published release
            const latestRelease = releasesResponse.data.find(release => !release.draft && !release.prerelease);
            if (latestRelease) return latestRelease.tag_name;
        }

        // Step 3: Fetch default branch as a fallback
        const repoResponse = await octokit.rest.repos.get({
            owner,
            repo,
        });

        return repoResponse.data.default_branch; // Usually 'main' or 'master'
    } catch (error) {
        console.error("Error fetching version:", error);
        throw new Error("Failed to fetch the latest version for the repository.");
    }
}





export async function getAllVersions(repoUrl: string): Promise<{ versions: string[], branches: string[] }> {
    try {
        // Parse the repository URL
        const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
        if (!match) {
            throw new Error("Invalid repository URL. Use the format 'https://github.com/owner/repo'.");
        }

        const [, owner, repo] = match;

        // Initialize arrays to hold versions and branches
        const versions: string[] = [];
        const branches: string[] = [];

        // Step 1: Fetch all tags (versions)
        const tagsResponse = await octokit.rest.repos.listTags({
            owner,
            repo,
            per_page: 100,
        });
        tagsResponse.data.forEach(tag => versions.push(tag.name));

        // Step 2: Fetch releases (versions)
        const releasesResponse = await octokit.rest.repos.listReleases({
            owner,
            repo,
            per_page: 100,
        });
        releasesResponse.data.forEach(release => {
            if (!release.draft && !release.prerelease) {
                versions.push(release.tag_name);
            }
        });

        // Step 3: Fetch branches
        const branchesResponse = await octokit.rest.repos.listBranches({
            owner,
            repo,
            per_page: 100,
        });
        branchesResponse.data.forEach(branch => branches.push(branch.name));

        // Remove duplicates in versions array by converting to Set and back to array
        const uniqueVersions = Array.from(new Set(versions));

        return { versions: uniqueVersions, branches };
    } catch (error) {
        console.error("Error fetching versions and branches:", error);
        throw new Error("Failed to fetch versions and branches for the repository.");
    }
}