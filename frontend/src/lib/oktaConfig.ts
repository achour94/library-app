export const oktaConfig = {
    clientId: '0oa91qogr3Yje5lpU5d7',
    issuer: 'https://dev-18185008.okta.com/oauth2/default',
    redirectUri: 'http://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true
};