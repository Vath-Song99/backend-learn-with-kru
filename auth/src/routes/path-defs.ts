export const PATH_AUTH = {
  baseAuth: "/v1/auth",
  signUp: "/signup",
  verify: "/verify",
  login: "/login",
  logout: "/logout",
  resetPassword: "/reset-password",
  resetPasswordVerify: "/reset-password/verify",
  googleOAuth: "/google",
  googleOAuthCallBack: "/google/callback",
  facebookOAuth: "/facebook",
  facebookOAuthCallBack: "/facebook/callback",
};

export const PATH_CRUD = {
  getUser: "/user/:authId",
};
