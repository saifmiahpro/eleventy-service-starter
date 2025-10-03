#!/usr/bin/env node

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const API_KEY = process.env.TALLY_API_KEY;
const FORM_ID = process.env.TALLY_FORM_ID;

console.log('🔍 Test authentification Tally API\n');
console.log(`Form ID: ${FORM_ID}`);
console.log(`API Key: ${API_KEY?.substring(0, 10)}...${API_KEY?.substring(API_KEY.length - 4)}\n`);

// Test 1: Bearer token
console.log('Test 1: Authorization Bearer...');
try {
  const response1 = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  console.log(`Status: ${response1.status} ${response1.statusText}`);
  if (!response1.ok) {
    const text = await response1.text();
    console.log(`Réponse: ${text.substring(0, 200)}`);
  }
} catch (error) {
  console.log(`Erreur: ${error.message}`);
}

console.log('\nTest 2: API-Key header...');
try {
  const response2 = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: {
      'API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log(`Status: ${response2.status} ${response2.statusText}`);
  if (!response2.ok) {
    const text = await response2.text();
    console.log(`Réponse: ${text.substring(0, 200)}`);
  }
} catch (error) {
  console.log(`Erreur: ${error.message}`);
}

console.log('\nTest 3: X-API-Key header...');
try {
  const response3 = await fetch(`https://api.tally.so/forms/${FORM_ID}/responses`, {
    headers: {
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  console.log(`Status: ${response3.status} ${response3.statusText}`);
  if (!response3.ok) {
    const text = await response3.text();
    console.log(`Réponse: ${text.substring(0, 200)}`);
  } else {
    console.log('✅ SUCCESS! Utiliser X-API-Key');
  }
} catch (error) {
  console.log(`Erreur: ${error.message}`);
}
