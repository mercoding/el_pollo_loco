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
    }
    onUpdate(deltaTime) {}
    onExit() {
        this.removeMenuListeners();
    }

    toggleMenu(event) {
        const input = this.inputHandler.getInput()
        if(!input.esc) return;
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
    }
}