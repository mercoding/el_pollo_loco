import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";

export class ClosedMenu {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.onStart();
    }

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

    onUpdate(deltaTime) {}


    onExit() {
        this.removeMenuListeners();
    }

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

    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.toggleMenu(event);

        window.addEventListener('keydown', this.keyListener);
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
    }

}