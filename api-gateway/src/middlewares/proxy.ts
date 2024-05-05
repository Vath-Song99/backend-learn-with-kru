import express, { Request, Response } from "express";
import { createProxyMiddleware , Options } from "http-proxy-middleware";
import { logger } from "../utils/logger";
import { ClientRequest, IncomingMessage } from "http";
import getConfig from "../utils/createConfig";
import { StatusCode } from "../utils/consts";
import { ROUTE_PATHS } from "@api-gateway/route-defs";

interface ProxyConfig {
  [context: string]: Options<IncomingMessage, Response>;
}

interface NetworkError extends Error {
  code?: string;
}

const config = getConfig();

// const checkTargetUrl = ()

// Define the proxy rules and targets
const proxyConfigs: ProxyConfig = {
  [ROUTE_PATHS.AUTH_SERVICE]: {
    target: config.authServiceUrl as string,
    pathRewrite: (path, _req ) => {
      return `${ROUTE_PATHS.AUTH_SERVICE}${path}`},
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, _res: Response) => {
        logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
        logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
        const expressReq = req as Request;
 
        // Extract JWT token from session
        const token = expressReq.session!.jwt;
        proxyReq.setHeader('Authorization', `Bearer ${token}`)
       
      },
      proxyRes: (proxyRes, req, res) => {
        let originalBody: Buffer[] = [];
        proxyRes.on('data', function (chunk: Buffer) {
          originalBody.push(chunk)
        })
        proxyRes.on('end', function () {
          const bodyString = Buffer.concat(originalBody).toString('utf8');
          let responseBody: { message?: string; token?: string; redirectUrl?: string; errors?: Array<object> };
          if (proxyRes.statusCode === 302 && proxyRes.headers.location) {
            const redirectUrl = proxyRes.headers.location;
            // Forward the redirect URL to the client
            return res.redirect(redirectUrl);
          }
          try {
            responseBody = JSON.parse(bodyString);
         
            // If Response Error, Not Modified Response
            if (responseBody.errors) {
              return res.status(proxyRes.statusCode!).json(responseBody)
            }
      
            // Store JWT in session
            if (responseBody.token) {
              (req as Request).session!.jwt = responseBody.token;
            }
      
            // Modify response to send only the message to the client
            res.json({ message: responseBody.message });
          } catch (error) {
            return res.status(500).json({ message: "Error parsing response" });
          }
        })
      },      
      error: (err: NetworkError, _req, res) => {
        logger.error(`Proxy Error: ${err}`)
        switch (err.code) {
          case 'ECONNREFUSED':
            (res as Response).status(StatusCode.ServiceUnavailable).json({ message: "The service is temporarily unavailable. Please try again later." });
            break;
          case 'ETIMEDOUT':
            (res as Response).status(StatusCode.GatewayTimeout).json({ message: "The request timed out. Please try again later." });
            break;
          default:
            (res as Response).status(StatusCode.InternalServerError).json({ message: "An internal error occurred." });
        }
      }
    },
  },
  [ROUTE_PATHS.TEACHER_SERVICE]: {
    target: config.teacherServiceUrl as string,
    pathRewrite: (path, _req ) => {
      return `${ROUTE_PATHS.TEACHER_SERVICE}${path}`},
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, _res: Response) => {
        logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
        logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
        const expressReq = req as Request;
 
        // Extract JWT token from session
        const token = expressReq.session!.jwt;
        proxyReq.setHeader('Authorization', `Bearer ${token}`)
       
      },
      proxyRes: (proxyRes, _req, res) => {
        let originalBody: Buffer[] = [];
        proxyRes.on('data', function (chunk: Buffer) {
          originalBody.push(chunk)
        })
        proxyRes.on('end', function () {
          const bodyString = Buffer.concat(originalBody).toString('utf8');
          let responseBody: { message?: string; token?: string; teachers: Array<object>; errors?: Array<object> };
          try {
            responseBody = JSON.parse(bodyString);
            // If Response Error, Not Modified Response
            if (responseBody.errors) {
              return res.status(proxyRes.statusCode!).json(responseBody)
            }
      
            // Modify response to send only the message to the client
            res.json({ message: responseBody.message , teachers: responseBody.teachers });
          } catch (error) {
            return res.status(500).json({ message: "Error parsing response" });
          }
        })
      },      
      error: (err: NetworkError, _req, res) => {
        logger.error(`Proxy Error: ${err}`)
        switch (err.code) {
          case 'ECONNREFUSED':
            (res as Response).status(StatusCode.ServiceUnavailable).json({ message: "The service is temporarily unavailable. Please try again later." });
            break;
          case 'ETIMEDOUT':
            (res as Response).status(StatusCode.GatewayTimeout).json({ message: "The request timed out. Please try again later." });
            break;
          default:
            (res as Response).status(StatusCode.InternalServerError).json({ message: "An internal error occurred." });
        }
      }
    },
  },
  [ROUTE_PATHS.STUDENT_SERVICE]: {
    target: config.studentServiceUrl as string,
    pathRewrite: (path, _req ) => {
      return `${ROUTE_PATHS.STUDENT_SERVICE}${path}`},
    changeOrigin: true,
    selfHandleResponse: true,
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, _res: Response) => {
        logger.info(`Proxied request URL: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
        logger.info(`Headers Sent: ${JSON.stringify(proxyReq.getHeaders())}`);
        const expressReq = req as Request;
 
        // Extract JWT token from session
        const token = expressReq.session!.jwt;
        proxyReq.setHeader('Authorization', `Bearer ${token}`)
      },
      proxyRes: (proxyRes, _req, res) => {
        let originalBody: Buffer[] = [];
        proxyRes.on('data', function (chunk: Buffer) {
          originalBody.push(chunk)
        })
        proxyRes.on('end', function () {
          const bodyString = Buffer.concat(originalBody).toString('utf8');
          let responseBody: { message?: string; token?: string; student: Array<object>; errors?: Array<object> };
          try {
            responseBody = JSON.parse(bodyString);
            // If Response Error, Not Modified Response
            if (responseBody.errors) {
              return res.status(proxyRes.statusCode!).json(responseBody)
            }
      
            // Modify response to send only the message to the client
            res.json({ message: responseBody.message , student: responseBody.student });
          } catch (error) {
            return res.status(500).json({ message: "Error parsing response" });
          }
        })
      },      
      error: (err: NetworkError, _req, res) => {
        logger.error(`Proxy Error: ${err}`)
        switch (err.code) {
          case 'ECONNREFUSED':
            (res as Response).status(StatusCode.ServiceUnavailable).json({ message: "The service is temporarily unavailable. Please try again later." });
            break;
          case 'ETIMEDOUT':
            (res as Response).status(StatusCode.GatewayTimeout).json({ message: "The request timed out. Please try again later." });
            break;
          default:
            (res as Response).status(StatusCode.InternalServerError).json({ message: "An internal error occurred." });
        }
      }
    },
  },
};


const applyProxy = (app: express.Application) => {
  Object.keys(proxyConfigs).forEach((context: string) => {
    app.use(context, createProxyMiddleware(proxyConfigs[context]));
  });
};

export default applyProxy;
