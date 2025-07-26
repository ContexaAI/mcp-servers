#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔨 Starting build process...');

// Check if TypeScript files exist and need compilation
const tsFiles = [
    'contexa-server.ts'
];

let hasTypeScript = false;
for (const tsFile of tsFiles) {
    if (existsSync(join(__dirname, tsFile))) {
        hasTypeScript = true;
        break;
    }
}

if (hasTypeScript) {
    console.log('📝 TypeScript files detected, checking for TypeScript compiler...');
    
    try {
        // Check if TypeScript is installed
        execSync('npx tsc --version', { stdio: 'pipe' });
        console.log('✅ TypeScript compiler found');
        
        // Check if tsconfig.json exists
        if (existsSync(join(__dirname, 'tsconfig.json'))) {
            console.log('📋 Found tsconfig.json, compiling TypeScript files...');
            execSync('npx tsc', { stdio: 'inherit', cwd: __dirname });
            console.log('✅ TypeScript compilation completed');
        } else {
            console.log('⚠️  No tsconfig.json found, skipping TypeScript compilation');
        }
    } catch (error) {
        console.log('⚠️  TypeScript compiler not found, skipping TypeScript compilation');
    }
} else {
    console.log('📄 No TypeScript files found, skipping compilation');
}

// Validate JavaScript files exist
const requiredFiles = [
    'server.js',
    'browser_tools.js',
    'browser_session.js'
];

console.log('🔍 Validating required files...');
for (const file of requiredFiles) {
    if (existsSync(join(__dirname, file))) {
        console.log(`✅ ${file} found`);
    } else {
        console.error(`❌ ${file} missing`);
        process.exit(1);
    }
}

// Check if contexa-server files exist
if (existsSync(join(__dirname, 'contexa-server.js')) || existsSync(join(__dirname, 'contexa-server.ts'))) {
    console.log('✅ Contexa server files found');
} else {
    console.warn('⚠️  Contexa server files not found');
}

// Validate package.json
console.log('📦 Validating package.json...');
try {
    const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
    
    if (!packageJson.name || !packageJson.version) {
        console.error('❌ package.json missing required fields (name, version)');
        process.exit(1);
    }
    
    console.log(`✅ package.json valid (${packageJson.name}@${packageJson.version})`);
} catch (error) {
    console.error('❌ Invalid package.json');
    process.exit(1);
}

console.log('🎉 Build completed successfully!');
console.log('');
console.log('📋 Available commands:');
console.log('  npm start     - Start the MCP server');
console.log('  npm run dev   - Start the MCP server in development mode');
console.log('  npm run build - Run this build process');
console.log('');
console.log('🚀 To start the server, run: npm start'); 