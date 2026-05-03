import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const secret = () => config.secretKey || 'dev-only-change-me';

export function createAccessToken(userId) {
  return jwt.sign({ sub: String(userId) }, secret(), {
    algorithm: config.algorithm,
    expiresIn: `${config.accessTokenExpireMinutes}m`,
  });
}

export function decodeToken(token) {
  return jwt.verify(token, secret(), { algorithms: [config.algorithm] });
}
