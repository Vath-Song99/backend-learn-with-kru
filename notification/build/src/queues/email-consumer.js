"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeAuthEmailMessages = void 0;
const logger_1 = require("../utils/logger");
const connection_1 = require("./connection");
const server_1 = require("../server");
const email_sender_1 = __importDefault(require("../utils/email-sender"));
function consumeAuthEmailMessages(channel) {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO:
        // 1. Check If Channel Exist. If Not Create Once
        // 2. Define ExchangeName, RoutingKey, QueueName
        // 3. Check if Exchange Exist, If Not Create Once
        // 4. Check if Queue Exist, If Not Create Once
        // 5. Bind the Exchange to Queue by Routing Key
        // 6. Consumer: Send Email When there is a message from Queue
        try {
            if (!channel) {
                channel = (yield (0, connection_1.createQueueConnection)());
            }
            const exchangeName = 'microsample-email-notification';
            const routingKey = 'auth-email';
            const queueName = 'auth-email-queue';
            yield channel.assertExchange(exchangeName, 'direct');
            const queue = yield channel.assertQueue(queueName, {
                durable: true,
                autoDelete: false,
            });
            yield channel.bindQueue(queue.queue, exchangeName, routingKey);
            channel.consume(queue.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg.content.toString());
                const locals = {
                    appLink: `${(0, server_1.getConfig)().clientUrl}`,
                    appIcon: ``,
                    username,
                    verifyLink,
                    resetLink,
                };
                const emailUserSender = email_sender_1.default.getInstance();
                yield emailUserSender.sendEmail(template, receiverEmail, locals);
                // Acknowledgement
                channel.ack(msg);
            }));
        }
        catch (error) {
            logger_1.logger.error(`NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`);
        }
    });
}
exports.consumeAuthEmailMessages = consumeAuthEmailMessages;
// export async function consumeSubmissionEmailMessages(
//   channel: Channel
// ): Promise<void> {
//   try {
//     if (!channel) {
//       channel = (await createQueueConnection()) as Channel;
//     }
//     const exchangeName = 'microsample-submission-notification';
//     const routingKey = 'submission-email';
//     const queueName = 'submission-email-queue';
//     await channel.assertExchange(exchangeName, 'direct');
//     const queue = await channel.assertQueue(queueName, {
//       durable: true,
//       autoDelete: false,
//     });
//     await channel.bindQueue(queue.queue, exchangeName, routingKey);
//     channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
//     });
//   } catch (error) {
//     logger.error(
//       `NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`
//     );
//   }
// }
//# sourceMappingURL=email-consumer.js.map