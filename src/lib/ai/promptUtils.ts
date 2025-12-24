/**
 * Replace template variables in a prompt string
 * Variables use {{variableName}} syntax
 */
export function replacePromptVariables(prompt: string, variables: Record<string, string>): string {
    let result = prompt;
    for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return result;
}
