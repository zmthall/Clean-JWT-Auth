import express from 'express';

// import (infrastructure layer)
import userRepository from '../database/repositories/userRepository.js';
import { jwtService } from '../services/jwtService.js';

// use-case imports (application layer)
import makeUseCases from '../../use-cases/user/userUseCases.js';

const useCases = {
    registerUser: makeUseCases.makeRegisterUser(userRepository, jwtService),
    loginUser: makeUseCases.makeLoginUser(userRepository, jwtService),
    refreshToken: makeUseCases.makeRefreshToken(jwtService),
    logoutUser: makeUseCases.makeLogoutUser(jwtService)
};

// controller import (presentation layer)
import { makeAuthController } from '../../controllers/user/authController.js';

const authController = makeAuthController(useCases);

const router = express.Router();

// middleware imports
import { verifyAccessToken } from '../middleware/verifyAccessToken.js';

router.get('/', verifyAccessToken, (req, res) => {
    res.send('yes');
});

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/refresh-token', authController.refreshToken);
router.delete('/logout', authController.logoutUser);

export default router;