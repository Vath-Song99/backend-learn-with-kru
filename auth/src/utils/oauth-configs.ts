import axios, { AxiosError } from "axios";
import { ApiError } from "../error/base-custom-error";
import {
  AccessInfo,
  ErrorResponse,
  RequestBody,
  TokenResponse,
} from "./@types/oauth.type";
import querystring from "querystring";

export class OauthConfig {
  private static instance: OauthConfig;

  private constructor() {
    // Any initialization logic you want to perform
  }

  public static async getInstance(): Promise<OauthConfig> {
    if (!OauthConfig.instance) {
      OauthConfig.instance = new OauthConfig();
    }
    return OauthConfig.instance;
  }

  async getToken(
    requestBody: RequestBody,
    url: string
  ): Promise<TokenResponse> {
    try {
      const { data } = await axios.post<TokenResponse>(url, requestBody);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.error_description || axiosError.message;
        throw new ApiError(`Unable to configure user  API: ${errorMessage}`);
      } else {
        throw new ApiError(`Unknown error occurred: ${error}`);
      }
    }
  }

  async GoogleStrategy(code: string): Promise<TokenResponse> {
    const requestBody = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
      grant_type: "authorization_code",
    };
    const url = "https://oauth2.googleapis.com/token";
    try {
      return await this.getToken(requestBody, url);
    } catch (error) {
      throw error;
    }
  }
  async FacebookStrategy(code: string): Promise<TokenResponse> {
    const requestBody = {
      client_id: process.env.FACEBOOK_APP_ID as string,
      client_secret: process.env.FACEBOOK_APP_SECRET as string,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI as string,
      code,
    };
    const url = `https://graph.facebook.com/v13.0/oauth/access_token`;
    try {
      return await this.getToken(requestBody, url);
    } catch (error) {
      throw error;
    }
  }

  async AccessInfo({ access_token, url }: AccessInfo) {
    try {
      const userInfoResponse = await axios.get(url, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return userInfoResponse;
    } catch (error: unknown) {
      throw new ApiError(error as string);
    }
  }

  async GoogleAccessInfo(access_token: string) {
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";
    try {
      return await this.AccessInfo({ access_token, url });
    } catch (error: unknown) {
      throw error;
    }
  }
  async FacebookAccessInfo(access_token: string) {
    const fields = "id,name,email,first_name,last_name,picture";
    const url = `https://graph.facebook.com/v13.0/me?fields=${fields}`;
    try {
      return await this.AccessInfo({ access_token, url });
    } catch (error: unknown) {
      throw error;
    }
  }

  async GoogleConfigUrl(clienId: string, redirectUri: string) {
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clienId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=email%20profile`;

      return authUrl;
    } catch (error: unknown) {
      throw new ApiError("Unable to AuthConfigUrl in Google API");
    }
  }
  public async FacebookConfigUrl(
    clienId: string,
    redirectUri: string
  ): Promise<string> {
    try {
      const queryParams = {
        client_id: clienId,
        redirect_uri: redirectUri,
        response_type: "code",
      };

      // Convert the object to a URL-encoded query string
      const queryString = querystring.stringify(queryParams);

      // Construct the full URL with the query string
      const url = `https://www.facebook.com/v19.0/dialog/oauth?${queryString}`;

      return url;
    } catch (error: unknown) {
      throw new ApiError("Unable to AuthConfigUrl in facebook api");
    }
  }
}
