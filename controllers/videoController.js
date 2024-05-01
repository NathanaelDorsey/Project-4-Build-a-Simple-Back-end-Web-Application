const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');

const videosFilePath = path.join(__dirname, '..', 'data', 'videos.json');

function readVideosData() {
    try {
        const data = fs.readFileSync(videosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read videos data:", error);
        return [];
    }
}

function saveVideosData(videos) {
    try {
        const data = JSON.stringify(videos, null, 4);
        fs.writeFileSync(videosFilePath, data);
    } catch (error) {
        console.error("Failed to save videos data:", error);
    }
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
