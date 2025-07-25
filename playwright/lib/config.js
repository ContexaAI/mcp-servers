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
import os from 'os';
import path from 'path';
import { devices } from 'playwright';
import { sanitizeForFilePath } from './tools/utils.js';
const defaultConfig = {
    browser: {
        browserName: 'chromium',
        launchOptions: {
            channel: 'chrome',
            headless: os.platform() === 'linux' && !getEnv('DISPLAY'),
            chromiumSandbox: true,
        },
        contextOptions: {
            viewport: null,
        },
    },
    network: {
        allowedOrigins: undefined,
        blockedOrigins: undefined,
    },
    server: {},
    outputDir: path.join(os.tmpdir(), 'playwright-mcp-output', sanitizeForFilePath(new Date().toISOString())),
};
export async function resolveConfig(config) {
    return mergeConfig(defaultConfig, config);
}
export async function resolveCLIConfig(cliOptions) {
    const configInFile = await loadConfig(cliOptions.config);
    const envOverrides = configFromEnv();
    const cliOverrides = configFromCLIOptions(cliOptions);
    let result = defaultConfig;
    result = mergeConfig(result, configInFile);
    result = mergeConfig(result, envOverrides);
    result = mergeConfig(result, cliOverrides);
    // Derive artifact output directory from config.outputDir
    if (result.saveTrace)
        result.browser.launchOptions.tracesDir = path.join(result.outputDir, 'traces');
    return result;
}
export function configFromCLIOptions(cliOptions) {
    let browserName;
    let channel;
    switch (cliOptions.browser) {
        case 'chrome':
        case 'chrome-beta':
        case 'chrome-canary':
        case 'chrome-dev':
        case 'chromium':
        case 'msedge':
        case 'msedge-beta':
        case 'msedge-canary':
        case 'msedge-dev':
            browserName = 'chromium';
            channel = cliOptions.browser;
            break;
        case 'firefox':
            browserName = 'firefox';
            break;
        case 'webkit':
            browserName = 'webkit';
            break;
    }
    // Launch options
    const launchOptions = {
        channel,
        executablePath: cliOptions.executablePath,
        headless: cliOptions.headless,
    };
    // --no-sandbox was passed, disable the sandbox
    if (cliOptions.sandbox === false)
        launchOptions.chromiumSandbox = false;
    if (cliOptions.proxyServer) {
        launchOptions.proxy = {
            server: cliOptions.proxyServer
        };
        if (cliOptions.proxyBypass)
            launchOptions.proxy.bypass = cliOptions.proxyBypass;
    }
    if (cliOptions.device && cliOptions.cdpEndpoint)
        console.warn('Warning: Device emulation is not supported with cdpEndpoint, continuing without device emulation.');
    // Context options
    const contextOptions = cliOptions.device ? devices[cliOptions.device] : {};
    if (cliOptions.storageState)
        contextOptions.storageState = cliOptions.storageState;
    if (cliOptions.userAgent)
        contextOptions.userAgent = cliOptions.userAgent;
    if (cliOptions.viewportSize) {
        try {
            const [width, height] = cliOptions.viewportSize.split(',').map(n => +n);
            if (isNaN(width) || isNaN(height)) {
                console.warn('Warning: Invalid viewport size values, using default viewport.');
                // Continue without setting viewport
            }
            else {
                contextOptions.viewport = { width, height };
            }
        }
        catch (e) {
            console.warn('Warning: Invalid viewport size format: use "width,height", for example --viewport-size="800,600". Using default viewport.');
        }
    }
    if (cliOptions.ignoreHttpsErrors)
        contextOptions.ignoreHTTPSErrors = true;
    if (cliOptions.blockServiceWorkers)
        contextOptions.serviceWorkers = 'block';
    const result = {
        browser: {
            browserName,
            isolated: cliOptions.isolated,
            userDataDir: cliOptions.userDataDir,
            launchOptions,
            contextOptions,
            cdpEndpoint: cliOptions.cdpEndpoint,
        },
        server: {
            port: cliOptions.port,
            host: cliOptions.host,
        },
        capabilities: cliOptions.caps,
        network: {
            allowedOrigins: cliOptions.allowedOrigins,
            blockedOrigins: cliOptions.blockedOrigins,
        },
        saveSession: cliOptions.saveSession,
        saveTrace: cliOptions.saveTrace,
        outputDir: cliOptions.outputDir,
        imageResponses: cliOptions.imageResponses,
    };
    return result;
}
import { getSemicolonListEnv, getBooleanEnv, getEnv, getNumberEnv, getCommaListEnv } from './env-config.js';
function configFromEnv() {
    const options = {};
    options.allowedOrigins = getSemicolonListEnv('PLAYWRIGHT_MCP_ALLOWED_ORIGINS');
    options.blockedOrigins = getSemicolonListEnv('PLAYWRIGHT_MCP_BLOCKED_ORIGINS');
    options.blockServiceWorkers = getBooleanEnv('PLAYWRIGHT_MCP_BLOCK_SERVICE_WORKERS');
    options.browser = getEnv('PLAYWRIGHT_MCP_BROWSER');
    options.caps = getCommaListEnv('PLAYWRIGHT_MCP_CAPS');
    options.cdpEndpoint = getEnv('PLAYWRIGHT_MCP_CDP_ENDPOINT');
    options.config = getEnv('PLAYWRIGHT_MCP_CONFIG');
    options.device = getEnv('PLAYWRIGHT_MCP_DEVICE');
    options.executablePath = getEnv('PLAYWRIGHT_MCP_EXECUTABLE_PATH');
    options.headless = getBooleanEnv('PLAYWRIGHT_MCP_HEADLESS');
    options.host = getEnv('PLAYWRIGHT_MCP_HOST');
    options.ignoreHttpsErrors = getBooleanEnv('PLAYWRIGHT_MCP_IGNORE_HTTPS_ERRORS');
    options.isolated = getBooleanEnv('PLAYWRIGHT_MCP_ISOLATED');
    if (getEnv('PLAYWRIGHT_MCP_IMAGE_RESPONSES') === 'omit')
        options.imageResponses = 'omit';
    options.sandbox = getBooleanEnv('PLAYWRIGHT_MCP_SANDBOX');
    options.outputDir = getEnv('PLAYWRIGHT_MCP_OUTPUT_DIR');
    options.port = getNumberEnv('PLAYWRIGHT_MCP_PORT');
    options.proxyBypass = getEnv('PLAYWRIGHT_MCP_PROXY_BYPASS');
    options.proxyServer = getEnv('PLAYWRIGHT_MCP_PROXY_SERVER');
    options.saveTrace = getBooleanEnv('PLAYWRIGHT_MCP_SAVE_TRACE');
    options.storageState = getEnv('PLAYWRIGHT_MCP_STORAGE_STATE');
    options.userAgent = getEnv('PLAYWRIGHT_MCP_USER_AGENT');
    options.userDataDir = getEnv('PLAYWRIGHT_MCP_USER_DATA_DIR');
    options.viewportSize = getEnv('PLAYWRIGHT_MCP_VIEWPORT_SIZE');
    return configFromCLIOptions(options);
}
async function loadConfig(configFile) {
    if (!configFile)
        return {};
    try {
        return JSON.parse(await fs.promises.readFile(configFile, 'utf8'));
    }
    catch (error) {
        console.warn(`Warning: Failed to load config file: ${configFile}, ${error}. Continuing with default configuration.`);
        return {};
    }
}
export async function outputFile(config, name) {
    await fs.promises.mkdir(config.outputDir, { recursive: true });
    const fileName = sanitizeForFilePath(name);
    return path.join(config.outputDir, fileName);
}
function pickDefined(obj) {
    return Object.fromEntries(Object.entries(obj ?? {}).filter(([_, v]) => v !== undefined));
}
function mergeConfig(base, overrides) {
    const browser = {
        ...pickDefined(base.browser),
        ...pickDefined(overrides.browser),
        browserName: overrides.browser?.browserName ?? base.browser?.browserName ?? 'chromium',
        isolated: overrides.browser?.isolated ?? base.browser?.isolated ?? false,
        launchOptions: {
            ...pickDefined(base.browser?.launchOptions),
            ...pickDefined(overrides.browser?.launchOptions),
            ...{ assistantMode: true },
        },
        contextOptions: {
            ...pickDefined(base.browser?.contextOptions),
            ...pickDefined(overrides.browser?.contextOptions),
        },
    };
    if (browser.browserName !== 'chromium' && browser.launchOptions)
        delete browser.launchOptions.channel;
    return {
        ...pickDefined(base),
        ...pickDefined(overrides),
        browser,
        network: {
            ...pickDefined(base.network),
            ...pickDefined(overrides.network),
        },
        server: {
            ...pickDefined(base.server),
            ...pickDefined(overrides.server),
        },
    };
}
export function semicolonSeparatedList(value) {
    if (!value)
        return undefined;
    return value.split(';').map(v => v.trim());
}
export function commaSeparatedList(value) {
    if (!value)
        return undefined;
    return value.split(',').map(v => v.trim());
}
function envToNumber(value) {
    if (!value)
        return undefined;
    return +value;
}
function envToBoolean(value) {
    if (value === 'true' || value === '1')
        return true;
    if (value === 'false' || value === '0')
        return false;
    return undefined;
}
function envToString(value) {
    return value ? value.trim() : undefined;
}
