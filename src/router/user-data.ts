import express from 'express';
import controller from '../controller/user-data';
const router = express.Router();

router.post('/users',controller.saveUserData);
router.get('/users/:id',controller.fetchUserDataById)
export = router;