const express = require('express');
const userController = require('../controllers/userController');
const Auth = require('../middleware/Auth');
const adminController = require('../controllers/adminController');
const eventController = require('../controllers/eventController');


const router = express.Router();

router.get('/',userController.home);
router.get('/login',userController.login);
router.get('/signup',userController.signup);
router.post('/signup_insert',userController.signup_insert);
router.post('/login_insert',userController.login_insert);
router.get('/logout',userController.logout);


router.get('/admin_dashboard',Auth, adminController.admin_dashboard);
router.get('/user_dashboard',Auth, userController.user_dashboard);

router.get('/add_event', Auth, eventController.add_event);
router.post('/create_event', Auth, eventController.create_event);

module.exports = router;