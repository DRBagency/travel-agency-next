import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
];

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://travel-agency-next-ten.vercel.app"
    : "http://localhost:3000";

const ADMIN_REDIRECT_URI = `${BASE_URL}/api/admin/calendar/oauth/callback`;
const OWNER_REDIRECT_URI = `${BASE_URL}/api/owner/calendar/oauth/callback`;

export function getOAuth2Client(redirectUri?: string) {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri || ADMIN_REDIRECT_URI
  );
}

export function getAuthUrl(state: string, redirectUri?: string) {
  const oauth2Client = getOAuth2Client(redirectUri);
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
  });
}

export function getOwnerRedirectUri() {
  return OWNER_REDIRECT_URI;
}

export function getCalendarClient(refreshToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.calendar({ version: "v3", auth: oauth2Client });
}

export function getOAuth2ClientWithRefreshToken(refreshToken: string) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
}
