export interface TokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    id_token?: string;
  }
  
export interface ErrorResponse {
    error: string;
    error_description: string;
  }