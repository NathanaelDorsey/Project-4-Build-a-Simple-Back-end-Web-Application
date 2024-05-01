const path = require('path');
const fs = require('fs');
const videosFilePath = path.join(__dirname, '..', 'data', 'videos.json');

// Utility to read videos
function readVideosData() {
    const data = fs.readFileSync(videosFilePath);
    return JSON.parse(data);
}

// Utility to save videos
function saveVideosData(videos) {
    const data = JSON.stringify(videos, null, 4);
    fs.writeFileSync(videosFilePath, data);
}
exports.newVideoForm = (req, res) => {
    res.render('newVideo');
};

exports.addNewVideo = (req, res) => {
    const { title, url } = req.body;
    if (!title || !url) {
        res.render('newVideo', { error: "All fields are required." });
        return;
    }

    const videos = readVideosData();
    videos.push({ title, url, uploader: req.session.user.email });
    saveVideosData(videos);

    res.redirect('/video/dashboard/all');
};

exports.displayDashboard = (req, res) => {
    const { videofilter } = req.params;
    const videos = readVideosData();
    const filteredVideos = videofilter === 'mine' ?
        videos.filter(video => video.uploader === req.session.user.email) :
        videos;

    res.render('dashboard', { videos: filteredVideos });
};
