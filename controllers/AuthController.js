import AuthService from '../services/AuthService.js';
import UserService from '../services/UserServices.js';

const frontendUrl = process.env.FRONTEND_URL;

class AuthController {
  /**
   * @swagger
   * /auth/google/url:
   *   get:
   *     summary: Get Google OAuth2 consent URL
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Consent page URL
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 url:
   *                   type: string
   *                   example: "https://accounts.google.com/o/oauth2/v2/auth?..."
   */
  async GetGoogleAuthURL(req, res) {
    try {
      const url = await AuthService.generateAuthUrl();
      res.status(200).json({ url });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /auth/google/callback:
   *   get:
   *     summary: Handle Google OAuth2 callback and issue JWT
   *     tags: [Auth]
   *     parameters:
   *       - in: query
   *         name: code
   *         required: true
   *         schema:
   *           type: string
   *         description: Authorization code from Google
   *     responses:
   *       302:
   *         description: Redirect to front-end with JWT and refresh token
   *       400:
   *         description: Authentication failed
   */
  async GoogleOAuthCallback(req, res) {
    const { code } = req.query;
    if (!code) return res.status(400).json({ success: false, error: 'NO_CODE' });
  
    try {
      const { id_token, refresh_token } = await AuthService.exchangeCode(code);
  
      const userInfo = await AuthService.verifyIdToken(id_token);
      const tokens = await UserService.OAuthLogin(userInfo.email, userInfo.name);
  
      return res.redirect(`${frontendUrl}/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Refresh JWT tokens
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refreshToken:
   *                 type: string
   *     responses:
   *       200:
   *         description: New Google tokens
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 accessToken:
   *                   type: string
   *                 refreshToken:
   *                   type: string 
   *       400:
   *         description: Refresh failed
   */
  async RefreshToken(req, res) {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: 'NO_REFRESH_TOKEN' });
    try {
      const tokens = await UserService.RefreshTokens(refreshToken);
      res.status(200).json({ success: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken});
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
}

export default new AuthController();
