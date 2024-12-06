import { InputHandler } from "../inputHandler.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Intro {
    constructor(ui) {
        this.ui = ui;
        this.background = new Image();
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.blinkTimer = 0; // Timer für das Blinken
        this.ui.global.audioManager.stopAll(); 
        this.removeMenuListeners();
        this.handleInteraction = this.handleInteraction.bind(this); // Bindung des Event-Handlers
        this.addInteractionListener(); // Hinzufügen der Maus- und Touch-Event-Listener
        this.onStart();
    }

    onStart() {
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.blinkTimer = 0; // Timer für das Blinken
        this.ui.global.audioManager.stopAll(); 
    }

    onUpdate(deltaTime) {
        this.drawPressAnyKey(deltaTime);
    }

    onExit() {
        this.removeInteractionListener(); // Entfernt die Event-Listener
    }

    setFont() {
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.font = `40px Boogaloo`;
        this.ui.ctx.textAlign = 'center';
    }

    drawBackground(background) {
        this.clearCanvas();
        this.ui.ctx.fillStyle = 'black';
        this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        this.ui.ctx.drawImage(background, 0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    drawPressAnyKey(deltaTime) {
        this.blinkTimer += deltaTime;
        const blink = Math.floor(this.blinkTimer * 2) % 2 === 0; // Einfache Blinklogik

        this.clearCanvas();
        this.drawBackground(this.background);

        if (blink) {
            this.setFont();
            this.ui.ctx.fillText("Press Any Key, Click Or Touch", this.ui.canvas.width / 2, this.ui.canvas.height - 64);
        }
    }

    clearCanvas() {
        this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    addInteractionListener() {
        window.addEventListener('keydown', this.handleInteraction, { once: true });
        window.addEventListener('mousedown', this.handleInteraction, { once: true });
        window.addEventListener('touchstart', this.handleInteraction, { once: true, passive: false }); // Explicitly disable passive
    }
    
    removeInteractionListener() {
        window.removeEventListener('keydown', this.handleInteraction);

        window.removeEventListener('mousedown', this.handleInteraction);
        window.removeEventListener('touchstart', this.handleInteraction, { passive: false }); // Match the options used when adding
    }
    

    handleInteraction(event) {
        event.preventDefault(); // Verhindert mögliche doppelte Ausführung bei Touch-Geräten
        this.ui.menu.changeMenu(new StartMenu(this.ui)); // Wechsel zum Startmenü
    }

    removeMenuListeners() {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);

            this.keyListener = null;
        }
        if (this.mouseListener) {
            this.ui.canvas.removeEventListener('click', this.mouseListener);
            this.mouseListener = null;
        }
        if (this.mouseHoverListener) {
            this.ui.canvas.removeEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
            this.mouseHoverListener = null;
        }
    }
}
