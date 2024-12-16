import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";

/**
 * In game scene loop by closed menu listen to p key for show in game menu
 *
 * @export
 * @class ClosedMenu
 * @typedef {ClosedMenu}
 */
export class ClosedMenu {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.onStart();
    }

    /** Set settings on start */
    onStart() {
        this.ui.global.inGame = true;
        this.ui.global.pause = false;
        this.ui.menuAktive = false;
        this.ui.intro = false;
        this.addMenuListeners();
        if (this.ui.global.getMusicOn()) this.ui.global.audioManager.playMusic('El Pollo Loco');
        this.ui.ctx.shadowColor = 'transparent';
        this.ui.ctx.shadowBlur = 0;
        this.ui.ctx.shadowOffsetX = 0;
        this.ui.ctx.shadowOffsetY = 0;
    }

    /**
     * Update function no things to do because game interactions
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {}


    /** Set settings on exit */
    onExit() {
        this.removeMenuListeners();
    }

    /**
     * Toggle menu scene to in game menu or to game loop
     *
     * @param {*} event
     */
    toggleMenu(event) {
        const input = this.inputHandler.getInput()
        if (!input.pKey) return;
        this.ui.menuActive = !this.menuActive;
        this.ui.global.pause = this.menuActive;
        this.selectedOption = 0; // Zurücksetzen der Auswahl

        if (this.ui.menuActive) {
            this.ui.global.audioManager.stopAll();
            this.ui.menu.changeMenu(new GameMenu(this.ui));
        } else {
            if (this.ui.global.getMusicOn()) this.ui.global.audioManager.playMusic('El Pollo Loco');
            this.removeMenuListeners();
        }
    }

    /** Add in game listener -> p key for in game menu */
    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.toggleMenu(event);

        window.addEventListener('keydown', this.keyListener);
    }

    /** Remove game listener */
    removeMenuListeners() {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);

            this.keyListener = null;
        }
        if (this.mouseListener) {
            this.ui.canvas.removeEventListener('click', this.mouseListener);
            this.mouseListener = null;
        }
    }

}