const { test, describe } = require('node:test');
const assert = require('node:assert');
const { validateApiUrl } = require('../entrypoint.js');

describe('Frontend boot guard for NEXT_PUBLIC_API_URL (Req 1.3, 1.4, Task 10.4)', () => {
  test('rejects undefined NEXT_PUBLIC_API_URL', () => {
    const result = validateApiUrl(undefined);
    assert.strictEqual(result.valid, false);
    assert.match(result.error, /NEXT_PUBLIC_API_URL/);
  });

  test('rejects null NEXT_PUBLIC_API_URL', () => {
    const result = validateApiUrl(null);
    assert.strictEqual(result.valid, false);
    assert.match(result.error, /NEXT_PUBLIC_API_URL/);
  });

  test('rejects empty string NEXT_PUBLIC_API_URL', () => {
    const result = validateApiUrl('');
    assert.strictEqual(result.valid, false);
    assert.match(result.error, /NEXT_PUBLIC_API_URL/);
  });

  test('rejects whitespace-only NEXT_PUBLIC_API_URL', () => {
    const result = validateApiUrl('   \t \n ');
    assert.strictEqual(result.valid, false);
    assert.match(result.error, /NEXT_PUBLIC_API_URL/);
  });

  test('accepts valid production API URL', () => {
    const result = validateApiUrl('https://api.singularsystem.com.br');
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.url, 'https://api.singularsystem.com.br');
  });

  test('trims surrounding whitespace from valid URL', () => {
    const result = validateApiUrl('  https://api.singularsystem.com.br  \n');
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.url, 'https://api.singularsystem.com.br');
  });
});
