import client, { Channel, Connection } from "amqplib";
import { logger } from "../utils/logger";
import getConfig from "../utils/config";

export async function createQueueConnection(): Promise<Channel | undefined> {
  try {
    const config = getConfig(process.env.NODE_ENV);
    const rabbitMQUrl = config.rabbitMQ;
    
    // Check if RabbitMQ URL is defined
    if (!rabbitMQUrl) {
      throw new Error("RabbitMQ URL is not defined in the configuration");
    }
    console.log(rabbitMQUrl)
    const connection: Connection = await client.connect(rabbitMQUrl);
    console.log("Heollo")
    const channel: Channel = await connection.createChannel();
    logger.info("Auth Server connected to queue successfully...");
    closeConnection(channel, connection)
    return channel;
  } catch (error) {
    logger.error(`Auth Server error createQueueConnection() method: ${error}`);
    return undefined;
  }
}

export async function closeConnection(
  channel: Channel,
  connection: Connection
): Promise<void> {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
}
