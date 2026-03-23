export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * P-02-SEC: OAuth state 암호화 (nonce 기반)
 * state = nonce(32hex) + '.' + base64(redirectUri)
 * 서버에서 nonce 검증으로 CSRF 방어
 */
function generateSecureState(redirectUri: string): string {
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const nonceHex = Array.from(nonce).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${nonceHex}.${btoa(redirectUri)}`;
}

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = generateSecureState(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
