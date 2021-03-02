const CSS_CENTERED = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);";
let spinner = null;
let player = null;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
    log: true,
    corePath: chrome.runtime.getURL("vendor/ffmpeg-core.js"),
});

const showSpinner = () => {
    spinner = document.createElement("img");
    spinner.src = chrome.runtime.getURL("assets/spinner.gif");
    spinner.style = CSS_CENTERED;
    document.body.append(spinner);
}

const hideSpinner = () => {
    if (spinner !== null) {
        spinner.remove();
    }
}

const getLecMedia = () => {
    var videos_html = document.getElementsByTagName("video");
    var urls = [];
    for (let video of videos_html) {
        urls.push(video.currentSrc);
    }
    return urls;
}

const getMergedFile = async (video, audio, filename) => {
    console.log("merging...");

    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    console.log("loaded");
    ffmpeg.FS("writeFile", "video.mp4", await fetchFile(video));
    console.log("wrote video");
    ffmpeg.FS("writeFile", "audio.mp4", await fetchFile(audio));
    console.log("wrote audio");
    await ffmpeg.run("-i", "video.mp4", "-i", "audio.mp4", "-c:v", "copy", "-c:a", "aac", filename);
    console.log("ran merge command...");
    const data = ffmpeg.FS('readFile', filename);
    console.log("read file");
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(new Blob([data.buffer], {
        type: "video/mp4"
    }));
    link.download = filename;
    link.click();
    console.log("download process started");
}

const merge = async (filename) => {
    showSpinner();
    var mediaFiles = getLecMedia();
    var video = mediaFiles[0],
        audio = mediaFiles[1];
    await getMergedFile(video, audio, filename);
    hideSpinner();
}

//TODO: SYNC AUDIO