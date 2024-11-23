import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import {register as registerService,login as loginService,verifyToken as verifyTokenService} from '../services/auth.service.js';

/**
 * User login controller
 * @param {Object} req
 * @param {Object} res
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const {tokens , role} = await loginService(email, password);
  
  res.status(httpStatus.OK).json({ message: 'Login successful', token:tokens,role });
});

/**
 * User registration controller
 * @param {Object} req
 * @param {Object} res
 */
const register = catchAsync(async (req, res) => {
  const user = await registerService(req.body);
  
  res.status(httpStatus.CREATED).json({ message: 'User registered successfully', user });
});

/**
 * Verify token controller
 * @param {Object} req
 * @param {Object} res
 */
const verifyToken = catchAsync(async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Token missing' });
  }

  const payload = verifyTokenService(token);
  res.status(httpStatus.OK).json({ message: 'Token valid', payload });
});

export {
  login,
  register,
  verifyToken,
};
