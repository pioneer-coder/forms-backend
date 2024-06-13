import express from 'express';

declare module 'http' {
  interface IncomingMessage {
    rawBody: string;
  }
}

export const json = express.json({
  limit: '5mb',
  verify: (req, res, buf) => {
    req.rawBody = buf?.toString();

    if (req.rawBody === 'INVALID') {
      req.rawBody = '{}';
    }
  },
});
export const urlencoded = express.urlencoded({ extended: true, limit: '5mb' });
