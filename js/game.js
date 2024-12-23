import { Game } from "../classes/game.class.js";

let game = new Game();
const canvas = document.getElementById('canvas');
const fullscreen = document.getElementById('fullscreen');

/** Change to fullscreen mode */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.error(`Fullscreen not available: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

fullscreen.addEventListener('click', toggleFullscreen);

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    } else {
        canvas.width = 720;
        canvas.height = 480;
    }
    //game.redrawGameObjects();
});

// Nur auf Desktop das Icon anzeigen
if (!/Mobi|Android/i.test(navigator.userAgent)) {
    fullscreen.style.display = 'block';
}

/** Initialize game loop */
function init() {
    game.Start();
}


window.init = init;
