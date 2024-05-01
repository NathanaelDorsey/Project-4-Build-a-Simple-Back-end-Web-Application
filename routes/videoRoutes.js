// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.get('/new_video', videoController.newVideoForm);
router.post('/new_video', videoController.addNewVideo);
router.get('/dashboard/:videofilter', videoController.displayDashboard);


module.exports = router;
