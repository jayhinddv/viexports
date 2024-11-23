import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // Import the User model
import httpStatus from 'http-status';
import { tokenTypes } from '../config/tokens.js';

/**
 * Register a new user.
 * @param {Object} userData - Data for the new user.
 * @returns {Object} - The registered user details.
 */
const register = async (userData) => {
  
  // Check if the email is already registered
  const existingUser = await db.User.findOne({ where: { email:userData.email } });
  if (existingUser) {
    throw { status: httpStatus.BAD_REQUEST, message: 'Email already registered' };
  }

  // Create a new user
  const user = await db.User.create(userData);

  // Return the user without sensitive data
  const { password: _, ...userWithoutPassword } = user.toJSON();
  return userWithoutPassword;
};

/**
 * Authenticate a user and generate tokens.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Object} - Authentication tokens.
 */
const login = async (email, password) => {
  // Find user by email
  const user = await db.User.findOne({ where: { email } });
  if (!user) {
    throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid email or password' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid email or password' };
  }

  // Generate tokens
  const tokens = generateAuthTokens(user.id);
  return {tokens,role : user.role};
};

/**
 * Verify the provided token.
 * @param {string} token - JWT token to verify.
 * @returns {Object} - Decoded token payload.
 */
const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload;
  } catch (err) {
    throw { status: httpStatus.UNAUTHORIZED, message: 'Invalid or expired token' };
  }
};

/**
 * Generate authentication tokens.
 * @param {number} userId - User ID.
 * @returns {Object} - Access and refresh tokens.
 */
const generateAuthTokens = (userId) => {
  const accessToken = jwt.sign({ userId , type: tokenTypes.ACCESS}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES });
  const refreshToken = jwt.sign({ userId , type: tokenTypes.REFRESH }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION_DAYS });

  return { accessToken, refreshToken };
};

export { register, login, verifyToken }; // Export only the required functions
