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
        else this.ui.global.audioManager.stopMusic('El Pollo Loco');
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
    onUpdate(deltaTime) {
        this.drawPauseButton();
    }


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
        this.touchListener = (event) => this.handlePauseButtonTouch(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
        this.mouseHoverListener = (event) => this.handleMouseHover(event);
        window.addEventListener('keydown', this.keyListener);
        this.ui.canvas.addEventListener('touchstart', this.touchListener);
        this.ui.canvas.addEventListener('click', this.mouseListener);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener);

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
        if (this.touchListener) {
            this.ui.canvas.removeEventListener('touchstart', this.handlePauseButtonTouch);
            this.touchListener = null;
        }
    }

    /**
     * Handle touch event on the pause button.
     * @param {*} event
     */
    handlePauseButtonTouch(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const x = event.touches[0].clientX - rect.left;
        const y = event.touches[0].clientY - rect.top;

        // Pause button dimensions
        const pauseButton = { x: this.ui.canvas.width / 2 - 25, y: 10, width: 50, height: 50 };

        // Check if the touch is within the pause button bounds
        if (x >= pauseButton.x && x <= pauseButton.x + pauseButton.width &&
            y >= pauseButton.y && y <= pauseButton.y + pauseButton.height
        ) {
            this.ui.global.audioManager.stopAll();
            this.ui.menu.changeMenu(new GameMenu(this.ui));
        }
    }

    /**
 * Draw a pause button on the canvas.
 */
    drawPauseButton() {
        //if(!this.hasTouchSupport()) return;
        const ctx = this.ui.canvas.getContext('2d');
        const buttonX = this.ui.canvas.width / 2 - 25;
        const buttonY = 35;
        const buttonWidth = 50;
        const buttonHeight = 50;
        ctx.fillStyle = '#000';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.fillStyle = '#fff';
        const barWidth = 10;
        const barSpacing = 10;
        ctx.fillRect(buttonX + 10, buttonY + 10, barWidth, buttonHeight - 20);
        ctx.fillRect(buttonX + 10 + barWidth + barSpacing, buttonY + 10, barWidth, buttonHeight - 20);
    }

    /**
     * Handle menu mouse input
     *
     * @param {*} event
     */
    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        // Pause button dimensions
        const pauseButton = { x: this.ui.canvas.width / 2 - 25, y: 35, width: 50, height: 50 };

        // Check if the touch is within the pause button bounds
        if (mouseX >= pauseButton.x && mouseX <= pauseButton.x + pauseButton.width &&
            mouseY >= pauseButton.y && mouseY <= pauseButton.y + pauseButton.height
        ) {
            this.ui.global.audioManager.stopAll();
            this.ui.menu.changeMenu(new GameMenu(this.ui));
        }

    }

    /**
     * Handle mouse hover effect -> cursor pointer
     *
     * @param {*} event
     */
    handleMouseHover(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        let isHovering = false;
        const pauseButton = { x: this.ui.canvas.width / 2 - 25, y: 35, width: 50, height: 50 };

        if (mouseX >= pauseButton.x && mouseX <= pauseButton.x + pauseButton.width &&
            mouseY >= pauseButton.y && mouseY <= pauseButton.y + pauseButton.height
        ) {
                isHovering = true;
        }

        this.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }

    /**
     * Check if user is on mobile device
     *
     * @returns {boolean}
     */
    hasTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
}