import { InputHandler } from "../inputHandler.class.js";
import { ClosedMenu } from "./closedMenu.class.js";
import { Controls } from "./controls.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { InfoMenu } from "./infoMenu.class.js";
import { Intro } from "./intro.class.js";
import { MenuGUI } from "./menuGUI.class.js";
import { Settings } from "./settings.class.js";

/**
 * Imprint which shows information of the creator and email link
 *
 * @export
 * @class StartMenu
 * @typedef {StartMenu}
 */
export class Imprint extends MenuGUI {
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
        this.menuOptions = ['eMail', 'Back']; // Menüoptionen
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
            y: this.ui.canvas.height / 2 + 30 + index * 70,
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
        this.drawImprint();
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
            const y = this.ui.canvas.height / 2 + 70 + index * 70;
            this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = this.selectedOption === index ? 'yellow' : 'white'; // Highlight
            if (option === "Quit") this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
            else this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
        });
    }


    /**
     * Call email program to send mail to creator
     *
     * @param {*} selected
     */
    eMail(selected) {
        if(selected === 'eMail') {
            window.location.href = 'mailto:martinreifschneider@mercoding.com';
        }
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
        this.eMail(selected);
        this.Back(selected);
    }

    /** Draw start menu */
    drawImprint() {        
        this.drawBackground(this.background);
        this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 203, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        const title = "Imprint";
        this.ui.ctx.fillText(title, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 130);
        const name = "Martin Reifschneider";
        this.ui.ctx.fillText(name, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 70);
        const street = "Breite Schneise 9";
        this.ui.ctx.fillText(street, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 30);
        const zipCity = "63674 Altenstadt";
        this.ui.ctx.fillText(zipCity, this.ui.canvas.width / 2, this.ui.canvas.height / 2  + 10);
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
                mouseY > button.y && mouseY < button.y + button.height
            ) {
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
            y: this.ui.canvas.height / 2 + 30 + index * 70,
            width: 200,
            height: 50,
        }));
    }
}
