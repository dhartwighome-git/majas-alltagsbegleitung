const state = { isScrubbing: false };
const container = document.getElementById('video-container');
const video = document.getElementById('video-element');
const playBtn = document.getElementById('play-btn');
const centerPlayBtn = document.getElementById('center-play-btn');
const seekBar = document.getElementById('seek-bar');
const muteBtn = document.getElementById('mute-btn');
const volumeSlider = document.getElementById('volume-slider');
const fullscreenBtn = document.getElementById('fullscreen-btn');

let savedVolume = 1;

/**
 * Syncs the visual icon display elements whenever play status alters
 */
function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.textContent = 'pause';
        centerPlayBtn.textContent = 'pause';
        container.classList.add('is-playing');
    } else {
        video.pause();
        playBtn.textContent = 'play_arrow';
        centerPlayBtn.textContent = 'play_arrow';
        container.classList.remove('is-playing');
    }
}

/**
 * Handles volume adjustments and sets appropriate icon glyph ranges
 */
function handleVolumeChange() {
    video.volume = volumeSlider.value;
    video.muted = (video.volume === 0);
    updateVolumeIcon();
}

/**
 * Toggles structural mute configurations back and forth
 */
function toggleMute() {
    if (video.muted) {
        video.muted = false;
        volumeSlider.value = savedVolume;
        video.volume = savedVolume;
    } else {
        savedVolume = video.volume > 0 ? video.volume : 1;
        video.muted = true;
        volumeSlider.value = 0;
        video.volume = 0;
    }
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (video.muted || video.volume === 0) {
        muteBtn.textContent = 'volume_off';
    } else if (video.volume < 0.5) {
        muteBtn.textContent = 'volume_down';
    } else {
        muteBtn.textContent = 'volume_up';
    }
}

/**
 * Triggers native browser fullscreen API configurations
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenBtn.textContent = 'fullscreen_exit';
    } else {
        document.exitFullscreen();
        fullscreenBtn.textContent = 'fullscreen';
    }
}

// Global Event Mapping Pipelines
playBtn.addEventListener('click', togglePlay);
centerPlayBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);

// Timeline Scrubbing Engine Bindings
video.addEventListener('timeupdate', () => {
    // Critical: Keep the lock active if the user is touching OR if the video is still actively seeking frames
    if (!state.isScrubbing && !video.seeking && video.duration && video.duration > 0) {
        const value = (video.currentTime / video.duration) * 100;
        seekBar.value = value;
        console.log("(timeupdate) Set seekBar.value to:", value);
    }
});

// 1. Handles active dragging AND clicking on modern browsers
seekBar.addEventListener('mousedown', () => { state.isScrubbing = true; });
seekBar.addEventListener('touchstart', () => { state.isScrubbing = true; });

seekBar.addEventListener('input', () => {
    if (video.duration) {
        const targetTime = (seekBar.value / 100) * video.duration;
        video.currentTime = targetTime;
        console.log("(input) Set video.currentTime to:", targetTime);
    }
});

// 2. Safeguard: Forces instant jump on absolute mouse clicks/touches
seekBar.addEventListener('change', () => {
    if (video.duration) {
        const targetTime = (seekBar.value / 100) * video.duration;
        video.currentTime = targetTime;
        console.log("(change) Set video.currentTime to:", targetTime);
    }
});

window.addEventListener('mouseup', () => { state.isScrubbing = false; });
window.addEventListener('touchend', () => { state.isScrubbing = false; });

// 3. New Pipeline Safeguard: Explicitly clear slider value updates when the jump finishes rendering
video.addEventListener('seeked', () => {
    if (video.duration && video.duration > 0) {
        const value = (video.currentTime / video.duration) * 100;
        seekBar.value = value;
        console.log("(seeked) Hard-sync post-jump value to:", value);
    }
});

// Audio & Screen Control Bindings
volumeSlider.addEventListener('input', handleVolumeChange);
muteBtn.addEventListener('click', toggleMute);
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Reset hooks on video completion
video.addEventListener('ended', () => {
    playBtn.textContent = 'play_arrow';
    centerPlayBtn.textContent = 'play_arrow';
    seekBar.value = 0;
    container.classList.remove('is-playing');
    console.log("(ended) Set seekbar.value to:", 0);
});