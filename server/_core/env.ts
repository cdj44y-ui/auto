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

// JWT_SECRET 최소 길이 검증 (프로덕션에서만 강제 종료)
if (ENV.cookieSecret.length < 32) {
  if (ENV.isProduction) {
    console.error('[FATAL] JWT_SECRET must be at least 32 characters.');
    process.exit(1);
  } else {
    console.warn('[WARN] JWT_SECRET is shorter than 32 characters. This would fail in production.');
  }
}
