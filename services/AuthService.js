import { OAuth2Client } from 'google-auth-library';

const clientId = process.env.GOOGLE_CLIETN_ID;
const clientSecret = process.env.GOOGLE_CLIETN_SECRET;
const redirectUrl = process.env.GOOGLE_REDIRECT_URL;

const client = new OAuth2Client(
  clientId,
  clientSecret,
  redirectUrl
);

class AuthService {
  async generateAuthUrl() {
    const scopes = ['openid', 'email', 'profile'];
    return client.generateAuthUrl({ access_type: 'offline', scope: scopes, prompt: 'consent' });
  }

  async exchangeCode(code) {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    return tokens;
  }

  async verifyIdToken(idToken) {
    const ticket = await client.verifyIdToken({ idToken, audience: clientId });
    const payload = ticket.getPayload();
    if (!payload) throw new Error('INVALID_ID_TOKEN');
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    };
  }

  async refresh(refreshToken) {
    client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await client.refreshAccessToken();
    return credentials;
  }
}

export default new AuthService();