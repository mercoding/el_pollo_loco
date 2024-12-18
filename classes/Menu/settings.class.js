import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { MenuGUI } from "./menuGUI.class.js";
import { SettingsEventListener } from "./settingsEventListener.class.js";
import { Slider } from "./slider.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Settings extends MenuGUI {
    constructor(ui) {
        super(ui);
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.buttonBackground = new Image();
        this.musicImage = new Image();
        this.soundImage = new Image();
        this.selectedOption = 0;
        this.setSlider();
        this.onStart();
    }

    setSlider() {
        this.sliders = [
            new Slider(this.ui, this.ui.canvas.width / 2 - 30, this.ui.canvas.height / 2 - 15, 
                100, 10, this.ui.global.audioManager.musicVolume, 'img/ui/Music.png',
                (value) => this.ui.global.setMusicVolumes(value), 1
            ),
            new Slider(this.ui, this.ui.canvas.width / 2 - 30, this.ui.canvas.height / 2 + 55, 
                100, 10, this.ui.global.audioManager.effectsVolume, 'img/ui/Sound.png',
                (value) => this.ui.global.setSoundVolumes(value), 2
            )
        ];
    }

    /** Set settings options */
    setSettingsOptions() {
        this.settingsOptions = [
            { label: 'Music On/Off', type: 'toggle', value: this.ui.global.getMusicOn() },
            { label: 'Music Volume', type: 'slider', value: this.ui.global.getMusicVolumes() },
            { label: 'Sound Volume', type: 'slider', value: this.ui.global.getSoundVolumes() },
            { label: 'Back', type: 'button' },
        ];
    }

    /** Set buttons positions */
    setButtonsPositions() {
        this.buttonPositions = this.settingsOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 110,
            y: this.ui.canvas.height / 2 - (index * 70),
            width: 200,
            height: 50,
        }));
    }

    /** Set settings on start */
    onStart() {
        this.setSettingsOptions();
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.startMenuBackground.src = "img/ui/panel.png";
        this.buttonBackground.src = "img/ui/button.png";
        this.musicImage.src = 'img/ui/Music.png';
        this.soundImage.src = 'img/ui/Sound.png';
        this.setButtonsPositions();
        this.ui.menuActive = true;
        this.eventListener = new SettingsEventListener(this);
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        this.drawSettingsMenu();
        this.updateUIPositions();
    }

    /** Set settings on exit */
    onExit() {
        this.eventListener.removeMenuListeners();
        this.ui.canvas.style.cursor = 'default';
    }


    /**
     * Draw toggle Music On / Off
     *
     * @param {*} option
     * @param {*} isSelected
     * @param {*} y
     */
    drawToggle(option, isSelected, y) {
        if (option.type === 'toggle') {
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            const status = option.value ? 'On' : 'Off';
            this.ui.ctx.fillText(`Music: `, this.ui.canvas.width / 2 - 20, y);
            this.ui.ctx.fillText(`${status}`, this.ui.canvas.width / 2 + 35, y);
        }
    }

    /**
     * Draw back button
     *
     * @param {*} option
     * @param {*} isSelected
     * @param {*} y
     */
    drawButton(option, isSelected, y) {
        if (option.type === 'button') {
            // "Back"-Option zeichnen
            const backY = this.ui.canvas.height - 70;
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ui.ctx.fillText("Back", this.ui.canvas.width / 2, y);
        }
    }

    /** Draw settings options */
    drawSettingsOptions() {
        this.settingsOptions.forEach((option, index) => {
            //const y = 170 + index * 80;
            const y = this.ui.canvas.height / 2 - 70 + index * 70;

            const isSelected = this.selectedOption === index;
            this.drawToggle(option, isSelected, y);
            //this.drawSlider(option, isSelected, y);
            this.drawButton(option, isSelected, y);
        });

        this.sliders.forEach((slider) => slider.draw());
    }

    /** Draw settings menu */
    drawSettingsMenu() {
        if (this.ui.global.inGame) {
            this.ui.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        } else {
            this.drawBackground(this.background);
            this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 203, 300, 400, 20, "transparent", 2, 0.85);
        }
       
        this.setFont();
        this.ui.ctx.fillText("Settings", this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 130);
        this.drawSettingsOptions();
    }

    /** Execute menu option */
    executeMenuOption() {
        this.ui.menuActive = true;
        this.ui.global.pause = true;
        if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
        else this.ui.menu.changeMenu(new GameMenu(this.ui));

    }


    /**
     * Handle toggle by mouse
     *
     * @param {*} option
     * @param {*} mouseX
     * @param {*} mouseY
     * @param {*} y
     */
    handleToggle(option, mouseX, mouseY, y) {
        if (option.type === 'toggle' &&
            mouseX > this.ui.canvas.width / 2 - 100 && mouseX < this.ui.canvas.width / 2 + 100 &&
            mouseY > y - 40 && mouseY < y + 20) {
            option.value = !option.value;
            this.applySettings(option.label, option.value);
        }
    }

    /**
     * Handle button by mouse
     *
     * @param {*} option
     * @param {*} mouseX
     * @param {*} mouseY
     * @param {*} y
     */
    handleButton(option, mouseX, mouseY, y) {
        if (option.type === 'button' &&
            mouseX > this.ui.canvas.width / 2 - 100 && mouseX < this.ui.canvas.width / 2 + 100 &&
            mouseY > y - 40 && mouseY < y + 20) {
            this.ui.menuActive = true;
            this.applySettings(option.label, option.value);
        }
    }


    /**
     * Apply Settings by mouse input
     *
     * @param {*} label
     * @param {*} value
     */
    applySettings(label, value) {
        if (label === 'Music Volume') this.ui.global.audioManager.musicVolume = value;
        else if (label === 'Sound Volume') this.ui.global.audioManager.effectsVolume = value;
        else if (label === 'Music On/Off') {
            this.ui.global.setMusicOn(value);
        }
        else if (label === "Back") {
            if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
            else this.ui.menu.changeMenu(new GameMenu(this.ui));
        }
    }


    /** Update UI positions */
    updateUIPositions() {
        this.buttonPositions = this.settingsOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 100,
            y: this.ui.canvas.height / 2 - 110 + index * 70,
            width: 200,
            height: 50,
        }));
        this.sliders[0].x = this.ui.canvas.width / 2 - 30;
        this.sliders[0].y = this.ui.canvas.height / 2 - 15;
        this.sliders[1].x = this.ui.canvas.width / 2 - 30;
        this.sliders[1].y = this.ui.canvas.height / 2 + 55;
    }

    /**
     * Toggle music volume between 0 and 0.5.
     */
    toggleMusicVolume() {
        const currentVolume = this.ui.global.audioManager.musicVolume;
        const newVolume = currentVolume === 0 ? 0.5 : 0;
        this.ui.global.setMusicVolumes(newVolume);
    }

    /**
     * Toggle sound volume between 0 and 0.5.
     */
    toggleSoundVolume() {
        const currentVolume = this.ui.global.audioManager.effectsVolume;
        const newVolume = currentVolume === 0 ? 0.5 : 0;
        this.ui.global.setSoundVolumes(newVolume);
    }
}