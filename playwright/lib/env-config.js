/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import fs from 'fs';
import path from 'path';
/**
 * Load environment variables from the JSON configuration
 */
export function loadEnvConfig() {
    try {
        const envConfigPath = path.join(process.cwd(), 'env-variables.json');
        const envConfigContent = fs.readFileSync(envConfigPath, 'utf8');
        const envVariables = JSON.parse(envConfigContent);
        const config = {};
        for (const envVar of envVariables) {
            const value = process.env[envVar.key];
            if (envVar.required && !value) {
                console.warn(`Warning: Required environment variable ${envVar.key} is not set, continuing with default behavior`);
            }
            if (value) {
                config[envVar.key] = value;
            }
            else if (envVar.value !== null) {
                config[envVar.key] = envVar.value;
            }
        }
        return config;
    }
    catch (error) {
        // Fallback to direct process.env access if JSON file is not available
        console.warn('Could not load env-variables.json, falling back to direct environment variable access');
        return process.env;
    }
}
/**
 * Get environment variable with type safety
 */
export function getEnv(key) {
    const config = loadEnvConfig();
    return config[key];
}
/**
 * Get required environment variable
 */
export function getRequiredEnv(key) {
    const value = getEnv(key);
    if (!value) {
        console.warn(`Warning: Required environment variable ${key} is not set, continuing with default behavior`);
        return '';
    }
    return value;
}
/**
 * Get boolean environment variable
 */
export function getBooleanEnv(key) {
    const value = getEnv(key);
    if (value === undefined)
        return undefined;
    return value.toLowerCase() === 'true' || value === '1';
}
/**
 * Get number environment variable
 */
export function getNumberEnv(key) {
    const value = getEnv(key);
    if (value === undefined)
        return undefined;
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
}
/**
 * Get comma-separated list environment variable
 */
export function getCommaListEnv(key) {
    const value = getEnv(key);
    if (!value)
        return undefined;
    return value.split(',').map(v => v.trim());
}
/**
 * Get semicolon-separated list environment variable
 */
export function getSemicolonListEnv(key) {
    const value = getEnv(key);
    if (!value)
        return undefined;
    return value.split(';').map(v => v.trim());
}
