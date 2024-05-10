import axios from 'axios';
import getConfig from './config';
import { logger } from './logger';

const config = getConfig()

export async function getUserInfo(authId: string ) {
   const url = config.authService
    try {
        const getUrl = `${url}/${authId}`
        const response = await axios.get(getUrl);

        return response.data;
    } catch (error) {
        logger.error('Error fetching user info:', error);
        throw error;
    }
}
