import axios, { AxiosInstance } from "axios";
import { logger } from "./logger";
import { User } from "../@types/user.type";
import getConfig from "./config";
import { PATH_USER } from "../routes/path-defs";

export async function getUserInfo(
  userId: string,
  httpClient: AxiosInstance = axios
): Promise<User> {
  if (!userId) {
    throw new Error("Invalid user ID");
  }

  const baseUrl = getConfig().userService;
  const userUrl = `${baseUrl}/${PATH_USER.GET}${userId}`;

  try {
    const response = await httpClient.get<User>(userUrl);
    return response.data;
  } catch (error) {
    logger.error(`Error fetching user info for user ID ${userId}:`, error);
    throw new Error(`Failed to fetch user info for user ID ${userId}`);
  }
}
