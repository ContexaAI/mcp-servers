#!/usr/bin/env node

/**
 * Test script for the new environment variable configuration system
 */

import { loadEnvConfig, getEnvValue, getProxyFromEnv } from './dist/config.js';

console.log('🧪 Testing Environment Variable Configuration System\n');

// Test 1: Load configuration
console.log('📋 Test 1: Loading environment configuration...');
try {
  const config = loadEnvConfig();
  console.log('✅ Configuration loaded successfully');
  console.log('📊 Configuration keys:', Object.keys(config));
  console.log('📊 Configuration values:', config);
} catch (error) {
  console.log('❌ Failed to load configuration:', error.message);
}

// Test 2: Get specific environment variable
console.log('\n📋 Test 2: Getting specific environment variable...');
try {
  const httpProxy = getEnvValue('HTTP_PROXY');
  console.log('✅ HTTP_PROXY value:', httpProxy);
} catch (error) {
  console.log('❌ Failed to get HTTP_PROXY:', error.message);
}

// Test 3: Get proxy configuration
console.log('\n📋 Test 3: Getting proxy configuration...');
try {
  const proxy = getProxyFromEnv();
  console.log('✅ Proxy configuration:', proxy || 'No proxy configured');
} catch (error) {
  console.log('❌ Failed to get proxy configuration:', error.message);
}

// Test 4: Test with environment variables
console.log('\n📋 Test 4: Testing with actual environment variables...');
process.env.HTTP_PROXY = 'http://test-proxy:8080';
process.env.HTTPS_PROXY = 'https://test-proxy:8080';

try {
  const configWithEnv = loadEnvConfig();
  console.log('✅ Configuration with env vars:', configWithEnv);
  
  const proxyWithEnv = getProxyFromEnv();
  console.log('✅ Proxy with env vars:', proxyWithEnv);
} catch (error) {
  console.log('❌ Failed to test with environment variables:', error.message);
}

console.log('\n🎉 Environment configuration test completed!'); 