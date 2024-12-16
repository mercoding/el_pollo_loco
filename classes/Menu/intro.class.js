import { InputHandler } from "../inputHandler.class.js";
import { MenuGUI } from "./menuGUI.class.js";
import { StartMenu } from "./startMenu.class.js";

/**
 * Intro scene shows El Pollo Loco start screen
 *
 * @export
 * @class Intro
 * @typedef {Intro}
 */
export class Intro extends MenuGUI{
    constructor(ui) {
        super(ui);
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

    /** Set settings on start */
    onStart() {
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.blinkTimer = 0; // Timer für das Blinken
        this.ui.global.audioManager.stopAll(); 
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        this.drawPressAnyKey(deltaTime);
    }

    /** Set settings on exit */
    onExit() {
        this.removeInteractionListener(); // Entfernt die Event-Listener
    }

    /**
     * Draw press any key blinked on bottom
     *
     * @param {*} deltaTime
     */
    drawPressAnyKey(deltaTime) {
        this.blinkTimer += deltaTime;
        const blink = Math.floor(this.blinkTimer * 2) % 2 === 0; // Einfache Blinklogik

        this.clearCanvas();
        this.drawBackground(this.background);

        if (blink) {
            this.setFont();
            this.ui.ctx.fillText("Press Any Key, Click Or Touch", this.ui.canvas.width / 2, this.ui.canvas.height - 32);
        }
    }



    /** Add listener */
    addInteractionListener() {
        window.addEventListener('keydown', this.handleInteraction, { once: true });
        window.addEventListener('mousedown', this.handleInteraction, { once: true });
        window.addEventListener('touchstart', this.handleInteraction, { once: true, passive: false }); // Explicitly disable passive
    }
    
    /** Remove listener */
    removeInteractionListener() {
        window.removeEventListener('keydown', this.handleInteraction);

        window.removeEventListener('mousedown', this.handleInteraction);
        window.removeEventListener('touchstart', this.handleInteraction, { passive: false }); // Match the options used when adding
    }
    

    /**
     * Handle user interactions
     *
     * @param {*} event
     */
    handleInteraction(event) {
        event.preventDefault(); // Verhindert mögliche doppelte Ausführung bei Touch-Geräten
        this.ui.menu.changeMenu(new StartMenu(this.ui)); // Wechsel zum Startmenü
    }

    /** Remove menu listeners */
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
