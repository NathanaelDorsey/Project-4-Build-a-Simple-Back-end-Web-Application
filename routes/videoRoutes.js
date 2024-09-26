
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/newVideo', videoController.newVideoForm);
router.post('/newVideo', videoController.addNewVideo);
router.post('/users/logout', videoController.logoutUser);
router.get('/dashboard/:videofilter', videoController.displayDashboard);


module.exports = router;
