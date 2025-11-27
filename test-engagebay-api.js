/**
 * EngageBay API Test - List All Contacts
 * Tests basic API connectivity by listing contacts
 * 
 * Run with: node test-engagebay-api.js
 */

import https from 'https';

// EngageBay API Configuration
const API_KEY = 'bvslvvtobrhmt6p9k0hf7e09gv';
const API_URL = 'app.engagebay.com';
const API_PATH = '/dev/api/panel/subscribers';

// Request body for listing contacts
const postData = JSON.stringify({
  page_size: 10,
  sort_key: '-created_time'
});

const options = {
  hostname: API_URL,
  path: API_PATH,
  method: 'POST',
  headers: {
    'Authorization': API_KEY,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Testing EngageBay API - List Contacts\n');
console.log('📍 Endpoint:', `https://${API_URL}${API_PATH}`);
console.log('� Requesting: 10 most recent contacts\n');
console.log('⏳ Sending request...\n');

const req = https.request(options, (res) => {
  let body = '';
  
  console.log('📥 Response Status:', res.statusCode);
  
  res.on('data', (chunk) => {
    body += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📦 Response Body:');
    console.log('─'.repeat(60));
    
    try {
      const parsed = JSON.parse(body);
      
      if (res.statusCode === 200) {
        console.log('\n✅ SUCCESS! API is working');
        console.log(`📊 Retrieved ${Array.isArray(parsed) ? parsed.length : 0} contacts\n`);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Show first 3 contacts
          const contactsToShow = parsed.slice(0, 3);
          contactsToShow.forEach((contact, idx) => {
            console.log(`Contact ${idx + 1}:`);
            console.log(`  🆔 ID: ${contact.id}`);
            console.log(`  📧 Email: ${contact.email || 'N/A'}`);
            console.log(`  👤 Name: ${contact.name || contact.firstname || 'N/A'}`);
            console.log(`  � Created: ${contact.created_time ? new Date(contact.created_time * 1000).toLocaleString() : 'N/A'}`);
            console.log();
          });
          
          if (parsed.length > 3) {
            console.log(`... and ${parsed.length - 3} more contacts`);
          }
        }
        
        console.log('─'.repeat(60));
        console.log('\n✅ API Authentication Working!');
        console.log('   Next step: Test contact creation endpoint');
      } else if (res.statusCode === 402) {
        console.log(JSON.stringify(parsed, null, 2));
        console.log('─'.repeat(60));
        console.log('\n❌ API RATE LIMIT REACHED');
        console.log('⚠️  Your EngageBay account has hit its API call quota');
        console.log('   The limit resets on December 3rd');
        console.log('   Try again after the reset or during off-peak hours');
      } else if (res.statusCode === 401) {
        console.log(JSON.stringify(parsed, null, 2));
        console.log('─'.repeat(60));
        console.log('\n❌ AUTHENTICATION FAILED');
        console.log('⚠️  Check your API key');
      } else {
        console.log(JSON.stringify(parsed, null, 2));
        console.log('─'.repeat(60));
        console.log(`\n❌ FAILED! Status: ${res.statusCode}`);
      }
    } catch (e) {
      console.log(body);
      console.log('─'.repeat(60));
      console.log('\n⚠️  Could not parse JSON response');
    }
  });
});

req.on('error', (e) => {
  console.error('\n❌ Request Error:', e.message);
});

req.write(postData);
req.end();