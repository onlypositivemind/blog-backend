export const makeAuthResponse = (userData) => ({
    accessToken: userData.tokens.accessToken,
    user: userData.user,
});
