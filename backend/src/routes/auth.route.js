import express from 'express';
import validate from '../middlewares/validate.js';
import authValidation from '../validations/auth.validation.js';
import {register,login,verifyToken} from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/sign-up',validate(authValidation.register), register);
router.post('/login',validate(authValidation.login), login);
router.get('/verify-token', verifyToken);
export default router;