import 'dotenv/config';
import { jest } from '@jest/globals';
import { MOCK_CURRENT_USER_ID } from './tests/support/factory';

jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    setSubject: jest.fn().mockReturnThis(),
    setJti: jest.fn().mockReturnThis(),
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  })),
  jwtVerify: jest.fn().mockImplementation(() => ({
    payload: { sub: MOCK_CURRENT_USER_ID },
    protectedHeader: {},
  })),
}));
