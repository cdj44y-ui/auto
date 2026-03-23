/**
 * P-01-SEC: 환경변수 시작 시 검증
 * 필수 환경변수 누락 시 서버 시작 거부
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    console.error(`[FATAL] Required environment variable ${key} is not set.`);
    process.exit(1);
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback;
}

export const ENV = {
  appId: requireEnv('VITE_APP_ID'),
  cookieSecret: requireEnv('JWT_SECRET'),
  databaseUrl: requireEnv('DATABASE_URL'),
  oAuthServerUrl: requireEnv('OAUTH_SERVER_URL'),
  ownerOpenId: optionalEnv('OWNER_OPEN_ID'),
  isProduction: process.env.NODE_ENV === 'production',
  forgeApiUrl: optionalEnv('BUILT_IN_FORGE_API_URL'),
  forgeApiKey: optionalEnv('BUILT_IN_FORGE_API_KEY'),
};

// JWT_SECRET 최소 길이 검증 — 경고만 출력 (배포 환경에서 process.exit 금지)
if (ENV.cookieSecret.length < 32) {
  console.warn('[WARN] JWT_SECRET is shorter than 32 characters. Consider using a longer secret for security.');
}
