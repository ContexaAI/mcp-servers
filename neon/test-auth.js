#!/usr/bin/env node

import { createNeonClient } from './dist/server/api.js';

const testKey = 'test_key_123';
const client = createNeonClient(testKey);

console.log('Testing Neon API authentication...');

try {
  const { data } = await client.getAuthDetails();
  console.log('Authentication successful:', data);
} catch (error) {
  console.error('Authentication failed:', error.message);
  console.error('Status:', error.status);
  console.error('Headers:', error.headers);
}
