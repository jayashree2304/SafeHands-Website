export function validateHoneypot(honeypotValue: string | null | undefined): boolean {
  // If honeypot field is filled out, it's a bot submission
  return !honeypotValue || honeypotValue.trim() === '';
}

export async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  // Mock turnstile verification or live secret verification
  if (!token) return true; // Optional soft fallback if CAPTCHA not mandatory in dev
  return token.length > 5;
}
