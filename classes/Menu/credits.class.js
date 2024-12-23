import { InputHandler } from "../inputHandler.class.js";
import { InfoMenu } from "./infoMenu.class.js";
import { MenuGUI } from "./menuGUI.class.js";

/**
 * Credits which show all assets like sounds which are used for this game
 *
 * @export
 * @class StartMenu
 * @typedef {StartMenu}
 */
export class Credits extends MenuGUI {
    constructor(ui) {
        super(ui);
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.buttonBackground = new Image();
        this.selectedOption = 0;
        this.onStart();
    }

    /** Set menu on start */
    onStart() {
        this.menuOptions = ['Back']; // Menüoptionen
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.startMenuBackground.src = "img/ui/panel.png";
        this.buttonBackground.src = "img/ui/button.png";
        this.ui.global.audioManager.musicVolume = this.ui.global.getMusicVolumes();
        this.ui.global.audioManager.effectsVolume = this.ui.global.getSoundVolumes();
        this.ui.intro = false;
        this.ui.menuActive = true;
        this.ui.global.inGame = false;
        this.ui.global.pause = true;
        this.setButtonPositions();
        this.addMenuListeners();
    }

    /** Set button positions */
    setButtonPositions() {
        this.buttonPositions = this.menuOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 110,
            y: this.ui.canvas.height / 2 + 100 + index * 70,
            width: 200,
            height: 50,
        }));
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        this.drawCredits();
        this.updateUIPositions();
    }

    /** Finish processes on exit */
    onExit() {
        this.removeMenuListeners();
        this.ui.canvas.style.cursor = 'default';
    }


    /** Draw start menu options */
    drawStartMenuOptions() {
        this.menuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 + 140 + index * 70;
            this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = this.selectedOption === index && !this.hasTouchSupport() ? 'yellow' : 'white'; // Highlight
            if (option === "Quit") this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
            else this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
        });
    }


    /**
     * Handle Quit option
     *
     * @param {*} selected
     */
    Back(selected) {
        if (selected === 'Back') {
            this.ui.global.inGame = false;
            this.ui.menuActive = false;
            this.ui.intro = false;
            this.selectedOption = 0;
            this.ui.menu.changeMenu(new InfoMenu(this.ui));
        }
    }

    /** Function which call selected option */
    selectOption() {
        const selected = this.menuOptions[this.selectedOption];
        this.Back(selected);
    }

    /** Draw start menu */
    drawCredits() {        
        this.drawBackground(this.background);
        this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 203, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        const title = "Credits";
        this.ui.ctx.fillText(title, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 130);
        const name = "Music: El Pollo Loco";
        this.ui.ctx.fillText(name, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 70);
        const street = "Udio AI created";
        this.ui.ctx.fillText(street, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 30);
        const zipCity = "Sounds: bought from";
        this.ui.ctx.fillText(zipCity, this.ui.canvas.width / 2, this.ui.canvas.height / 2  + 20);
        const unity = "Unity asset store";
        this.ui.ctx.fillText(unity, this.ui.canvas.width / 2, this.ui.canvas.height / 2  + 60);
        this.drawStartMenuOptions();
    }

    /**
     * Handle key input arrow up and down and enter for navigation
     *
     * @param {*} event
     */
    menuKeyInputInStartMenu(event) {
        const input = this.inputHandler.getInput();
        if (input.up) this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        else if (input.down) this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        else if (input.enter) this.selectOption();
    }


    /** Add menu listeners */
    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.menuKeyInputInStartMenu(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
        this.mouseHoverListener = (event) => this.handleMouseHover(event);
        this.handleMouseHoverImprint = (event) => this.handleMouseHoverImpressum(event);
        window.addEventListener('keydown', this.keyListener);
        this.ui.canvas.addEventListener('click', this.mouseListener);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
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


    /**
     * Handle menu mouse input
     *
     * @param {*} event
     */
    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);
    
        this.buttonPositions.forEach((button, index) => {
            if (mouseX > button.x && mouseX < button.x + button.width &&
                mouseY > button.y && mouseY < button.y + button.height) {
                this.selectedOption = index;
                this.selectOption();
            }
        });
        
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
        this.buttonPositions.forEach((button, index) => {
            if (mouseX > button.x && mouseX < button.x + button.width &&
                mouseY > button.y && mouseY < button.y + button.height) {
                isHovering = true;
                this.selectedOption = index;
            }
        });
        this.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }
    

    /** Update UI positions */
    updateUIPositions() {
        this.buttonPositions = this.menuOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 100,
            y: this.ui.canvas.height / 2 + 100 + index * 70,
            width: 200,
            height: 50,
        }));
    }
    
    /**
    * Check if device has touch support
    *
    * @returns {boolean}
    */    
    hasTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
}
