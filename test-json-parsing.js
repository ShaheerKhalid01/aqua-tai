// Simple test to isolate JSON parsing issue
console.log('Testing JSON parsing...');

try {
  const testJson = '{"valid": "json", "test": true}';
  const parsed = JSON.parse(testJson);
  console.log('✅ JSON parsing successful:', parsed);
} catch (error) {
  console.error('❌ JSON parsing failed:', error.message);
}

console.log('Test completed.');
