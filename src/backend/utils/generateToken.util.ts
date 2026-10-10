import { SignJWT } from 'jose';
import { env } from '../config/env';

const generateAccessToken = async (
  sub: string,
  role: 'User' | 'Admin',
): Promise<string> => {
  const payLoad = { role };

  return new SignJWT(payLoad)
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(new TextEncoder().encode(env.jwtSecret));
};

export default generateAccessToken;