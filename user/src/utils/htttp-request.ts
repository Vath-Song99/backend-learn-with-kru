import axios from 'axios';
import getConfig from './config';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'

const config = getConfig()

export async function getUserInfo(authId: string ) {
   const url = config.authService
    try {
        const getUrl = `${url}/v1/auth/users/${authId}`
        const response = await axios.get(getUrl);

        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
}

export const decodedToken = async (token: string) => {
    try {
      const data = await jwt.decode(token)as JwtPayload;
      return data.payload;
    } catch (error: unknown) {
      throw error;
    }
  };