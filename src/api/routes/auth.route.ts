import express from 'express';
import {
    refresh,
    signIn,
    signOut,
    signOutAll,
    signUp,
} from '../controllers/auth/index';
const router = express.Router();

router.get('/auth/refresh', refresh);
router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.delete('/auth/signout', signOut);
router.delete('/auth/signout_all', signOutAll);

export { router as authRouter };
