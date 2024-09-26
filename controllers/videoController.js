const sanitizeHtml = require('sanitize-html');

// In-memory storage for videos
let videoDatabase = [];

// Utility function to read videos data
function readVideosData() {
    return videoDatabase;
}

// Utility function to save videos data
function saveVideosData(videos) {
    videoDatabase = videos;
}

exports.newVideoForm = (req, res) => {
    if (!req.session.user) {
        res.redirect('/users/login');
        return;
    }
    res.render('newVideo');
};

exports.addNewVideo = (req, res) => {
    if (!req.session.user) {
        res.redirect('/users/login');
        return;
    }

    const title = sanitizeHtml(req.body.title);
    const urlInput = req.body.url;
    const sanitizedUrl = sanitizeHtml(urlInput);

    function convertYouTubeUrl(url) {
        const urlObj = new URL(url);
        const videoID = urlObj.searchParams.get("v");
        if (videoID) {
            return `https://www.youtube.com/embed/${videoID}`;
        }
        return url;
    }

    const embedUrl = convertYouTubeUrl(sanitizedUrl);

    if (!title || !sanitizedUrl) {
        res.render('newVideo', { error: "All fields are required." });
        return;
    }

    const videos = readVideosData();
    videos.push({ title, url: embedUrl, uploader: req.session.user.email });
    saveVideosData(videos);

    res.redirect('/video/dashboard/all');
};

exports.displayDashboard = (req, res) => {
    if (!req.session.user) {
        res.redirect('/users/login');
        return;
    }

    const { videofilter } = req.params;
    const videos = readVideosData();
    const filteredVideos = videofilter === 'mine' ?
        videos.filter(video => video.uploader === req.session.user.email) :
        videos;

    res.render('dashboard', { videos: filteredVideos });
};
