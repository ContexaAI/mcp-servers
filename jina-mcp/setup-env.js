#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const envConfig = [
  {
    "key": "JINA_API_KEY",
    "value": null,
    "required": true,
    "label": "JINA_API_KEY"
  }
];

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

try {
  // Create .env file
  fs.writeFileSync(envPath, JSON.stringify(envConfig, null, 2));
  console.log('✅ Created .env file');
  
  // Create .env.example file
  fs.writeFileSync(envExamplePath, JSON.stringify(envConfig, null, 2));
  console.log('✅ Created .env.example file');
  
  console.log('\n📝 Environment variables configured:');
  envConfig.forEach(item => {
    console.log(`   - ${item.key}: ${item.required ? 'REQUIRED' : 'OPTIONAL'}`);
  });
  
  console.log('\n💡 To set your Jina API key, edit the .env file and replace "value": null with your actual API key.');
  
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  process.exit(1);
} 