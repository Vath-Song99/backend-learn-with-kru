import axios, { AxiosError } from "axios";
import { ApiError } from "./base-custom-error";
import { ErrorResponse, TokenResponse } from "./@types/google.type";

export class GoogleOauthConfig {
  private static instance: GoogleOauthConfig;

  private constructor() {
    // Any initialization logic you want to perform
  }

  public static async getInstance(): Promise<GoogleOauthConfig> {
    if (!GoogleOauthConfig.instance) {
      GoogleOauthConfig.instance = new GoogleOauthConfig();
    }
    return GoogleOauthConfig.instance;
  }

  async getToken(code: string): Promise<TokenResponse> {
    const requestBody = {
      code,
      client_id: process.env.CLIENT_ID as string,
      client_secret: process.env.CLIENT_SECRET as string,
      redirect_uri: process.env.REDIRECT_URI as string,
      grant_type: "authorization_code",
    };

    try {
      const { data } = await axios.post<TokenResponse>(
        "https://oauth2.googleapis.com/token",
        requestBody
      );
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.error_description || axiosError.message;
        throw new ApiError(
          `Unable to configure user in Google API: ${errorMessage}`
        );
      } else {
        throw new ApiError(`Unknown error occurred: ${error}`);
      }
    }
  }

  async GoogleStrategy(code: string): Promise<TokenResponse> {
    try {
      return await this.getToken(code);
    } catch (error) {
      throw error;
    }
  }

  async AccessInfo(access_token: string) {
    try {
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return userInfoResponse;
    } catch (error: unknown) {
      throw new ApiError("Unable to access info in Google API");
    }
  }

  async AuthConfigUrl(clienId: string, redirectUri: string) {
    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clienId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=email%20profile`;

      return authUrl;
    } catch (error: unknown) {
      throw new ApiError("Unable to AuthConfigUrl in Google API");
    }
  }
}
