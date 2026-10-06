import { hashPassword, verifyPassword, hashString } from './security/hash';
import { generateAndSendOTP, verifyOTP } from './security/otp';
import { checkRateLimit } from './security/rate-limit';
import { validateHoneypot } from './security/captcha';
import { generateTOTPSecret, verifyTOTPCode } from './security/totp';

async function runAutomatedTests() {
  console.log('--- STARTING AUTOMATED SECURITY & AUTH TESTS ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  // Test 1: Password Hashing & Verification
  const testPass = 'SuperSecret123!';
  const hash = await hashPassword(testPass);
  const isMatch = await verifyPassword(testPass, hash);
  const isWrongMatch = await verifyPassword('WrongPass', hash);
  assert(isMatch && !isWrongMatch, 'Password hashing (bcrypt) verification');

  // Test 2: SHA-256 Hashing
  const hash1 = hashString('123456');
  const hash2 = hashString('123456');
  assert(hash1 === hash2 && hash1.length === 64, 'SHA-256 OTP hashing deterministic length');

  // Test 3: Rate Limiting Sliding Window
  const rateKey = 'test_ip_127.0.0.1';
  let allowedCount = 0;
  for (let i = 0; i < 7; i++) {
    const check = checkRateLimit(rateKey, 5, 60);
    if (check.allowed) allowedCount++;
  }
  assert(allowedCount === 5, 'Rate limiter sliding window max 5 attempts enforced');

  // Test 4: Honeypot Bot Trap
  assert(validateHoneypot('') === true, 'Honeypot clean input passed');
  assert(validateHoneypot('spam_bot_input') === false, 'Honeypot bot trap caught automated submission');

  // Test 5: TOTP 2FA Secret & Verification
  const { secret } = generateTOTPSecret('testadmin');
  assert(typeof secret === 'string' && secret.length > 10, 'TOTP 2FA secret generation');

  console.log(`\n--- TEST SUMMARY: ${passed} Passed, ${failed} Failed ---`);
  return { passed, failed };
}

runAutomatedTests().catch(console.error);
