import { GameMenu } from "./gameMenu.class.js";
import { StartMenu } from "./startMenu.class.js";

export class SettingsEventListener {
    constructor(settingsInstance) {
        this.ui = settingsInstance.ui;
        this.settings = settingsInstance;
        this.addMenuListeners();
    }

    /**
     * Handle up and down key for navigation in settings menu
     *
     * @param {*} event
     */
    handleArrowUpAndDown(event) {
        if (event.key === 'ArrowUp') {
            this.settings.selectedOption = (this.settings.selectedOption - 1 + this.settings.settingsOptions.length) % this.settings.settingsOptions.length;
        }
        else if (event.key === 'ArrowDown') {
            this.settings.selectedOption = (this.settings.selectedOption + 1) % this.settings.settingsOptions.length;
        }
    }

    /**
     * Handle arrow left key for substract volume on sliders
     *
     * @param {*} event
     * @param {*} currentOption
     */
    handleArrowLeft(event, currentOption) {
        if (event.key === 'ArrowLeft' && currentOption.type === 'slider') {
            currentOption.value = Math.max(0, currentOption.value - 0.1); // Reduziert den Wert
            if (currentOption.label === "Music Volume") {
                this.settings.ui.global.setMusicVolumes(currentOption.value);
                this.settings.sliders[0].value = currentOption.value;
            }
            else if (currentOption.label === "Sound Volume") {
                this.settings.ui.global.setSoundVolumes(currentOption.value);
                this.settings.sliders[1].value = currentOption.value;
            }
        }
    }

    /**
     * Handle arrow right key for add volume on sliders
     *
     * @param {*} event
     * @param {*} currentOption
     */
    handleArrowRight(event, currentOption) {
        if (event.key === 'ArrowRight' && currentOption.type === 'slider') {
            currentOption.value = Math.min(1, currentOption.value + 0.1); // Erhöht den Wert
            if (currentOption.label === "Music Volume") {
                this.settings.ui.global.setMusicVolumes(currentOption.value);
                this.settings.sliders[0].value = currentOption.value;

            }
            else if (currentOption.label === "Sound Volume") {
                this.settings.ui.global.setSoundVolumes(currentOption.value);
                this.settings.sliders[1].value = currentOption.value;

            }
        }
    }

    /** Select current slider and mark it yellow */
    selectSliderByArrowKeyInput() {
        if (this.settings.selectedOption === 1) {
            this.settings.sliders[0].selected = true;
            this.settings.sliders[1].selected = false;
        }
        else if (this.settings.selectedOption === 2) {
            this.settings.sliders[0].selected = false;
            this.settings.sliders[1].selected = true;
        }
        else {
            this.settings.sliders[0].selected = false;
            this.settings.sliders[1].selected = false;
        }
    }

    /**
    * Handle arrow key on slider music volume / sound volume
    *
    * @param {*} event
    * @param {*} currentOption
    */
    handleArrowKeyInput(event, currentOption) {
        this.handleArrowUpAndDown(event);
        this.handleArrowLeft(event, currentOption);
        this.handleArrowRight(event, currentOption);
        this.selectSliderByArrowKeyInput();
    }

    /**
     * Handle mouse down
     *
     * @param {*} canvas
     */
    handleMousedown(canvas) {
        canvas.addEventListener('mousedown', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            this.settings.sliders.forEach((slider) => slider.handleMouseDown(mouseX, mouseY));
        });
    }

    /**
     * Handle mouse move
     *
     * @param {*} canvas
     */
    handleMousemove(canvas) {
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;

            this.settings.sliders.forEach((slider) => slider.handleMouseMove(mouseX));
        });
    }

    /**
     * Handle mouse up
     *
     * @param {*} canvas
     */
    handleMouseup(canvas) {
        canvas.addEventListener('mouseup', () => {
            this.settings.sliders.forEach((slider) => slider.handleMouseUp());
        });
    }

    /**
     * Handle touch begin
     *
     * @param {*} canvas
     */
    handleTouchstart(canvas) {
        canvas.addEventListener('touchstart', (event) => {
            const rect = canvas.getBoundingClientRect();
            const touchX = event.touches[0].clientX - rect.left;
            const touchY = event.touches[0].clientY - rect.top;

            this.settings.sliders.forEach((slider) => slider.handleMouseDown(touchX, touchY));
        });
    }

    /**
     * Handle touch move
     *
     * @param {*} canvas
     */
    handleTouchmove(canvas) {
        canvas.addEventListener('touchmove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const touchX = event.touches[0].clientX - rect.left;

            this.settings.sliders.forEach((slider) => slider.handleMouseMove(touchX));
        });
    }

    /**
     * Handle touch event if user leave display
     *
     * @param {*} canvas
     */
    handleTouchend(canvas) {
        canvas.addEventListener('touchend', () => {
            this.settings.sliders.forEach((slider) => slider.handleMouseUp());
        });
    }

    /** Handle all events on sliders */
    handleSliderEvents() {
        const canvas = this.ui.ctx.canvas;
        this.handleMousedown(canvas);
        this.handleMousemove(canvas);
        this.handleMousemove(canvas);
        this.handleMouseup(canvas);
        this.handleTouchstart(canvas);
        this.handleTouchmove(canvas);
        this.handleTouchend(canvas);
    }

    /** Add listeners */
    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.handleSettingsInput(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
        this.mouseHoverListener = (event) => this.handleMouseHover(event);
        window.addEventListener('keydown', this.keyListener);
        this.settings.ui.canvas.addEventListener('click', this.mouseListener);
        this.settings.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
        this.handleSliderEvents();
        window.addEventListener('click', this.handleClick.bind(this));
    }

    /** Remove listeners */
    removeMenuListeners() {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);

            this.keyListener = null;
        }
        if (this.settings.mouseListener) {
            this.settings.ui.canvas.removeEventListener('click', this.mouseListener);
            this.settings.mouseListener = null;
        }
        if (this.mouseHoverListener) {
            this.settings.ui.canvas.removeEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
            this.settings.mouseHoverListener = null;
        }
        this.removeSliderListener();
    }



    removeSliderListener() {
        this.handleSliderEvents();
        const canvas = this.ui.ctx.canvas;
        canvas.removeEventListener('mousedown', this.handleMousedown);
        canvas.removeEventListener('mousemove', this.handleMousemove);
        canvas.removeEventListener('mouseup', this.handleMouseup);
        canvas.removeEventListener('touchstart', this.handleTouchstart);
        canvas.removeEventListener('touchmove', this.handleTouchmove);
        canvas.removeEventListener('touchend', this.handleTouchend);
    }


    /**
     * Handle mouse hover effect -> cursor pointer
     *
     * @param {*} event
     */
    handleMouseHover(event) {
        const rect = this.settings.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.settings.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.settings.ui.canvas.height / rect.height);
        let isHovering = false;
        this.settings.buttonPositions.forEach((button, index) => {
            if (
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height
            ) {
                isHovering = true;
                this.settings.selectedOption = index;
            }
        });
        this.settings.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }

    /**
     * Handle mouse input
     *
     * @param {*} event
     */
    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        // Settings-Menü
        this.settings.settingsOptions.forEach((option, index) => {
            const y = this.settings.ui.canvas.height / 2 - 70 + index * 70;
            //this.handleSlider(option, mouseX, mouseY, y);
            this.settings.handleToggle(option, mouseX, mouseY, y);
            this.settings.handleButton(option, mouseX, mouseY, y);
        });
    }

    /**
     * Handle enter key on toggle music on / off
     *
     * @param {*} event
     * @param {*} currentOption
     */
    handleEnterKeyInput(event, currentOption) {
        if (event.key === 'Enter' && currentOption.type === 'toggle') {
            currentOption.value = !currentOption.value; // Umschalten
            this.settings.ui.global.setMusicOn(currentOption.value);
        }
        else if (event.key === 'Enter' && currentOption.type === 'button') {
            this.selectedOption = 1;
            if (!this.settings.ui.global.inGame) this.settings.ui.menu.changeMenu(new StartMenu(this.ui));
            else this.settings.ui.menu.changeMenu(new GameMenu(this.ui));

        }
    }

    /**
     * Handle esc key for back
     *
     * @param {*} event
     */
    handleEscapeKeyInput(event) {
        if (event.key === 'Escape') {
            this.ui.global.inGame ? this.ui.menu.changeMenu(new GameMenu(this.ui)) : this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    /**
     * Handle settings key input
     *
     * @param {*} event
     */
    handleSettingsInput(event) {
        const currentOption = this.settings.settingsOptions[this.settings.selectedOption];
        this.ui.global.getVolumes();
        this.handleArrowKeyInput(event, currentOption);
        this.handleEnterKeyInput(event, currentOption);
        this.handleEscapeKeyInput(event);
    }

    /**
     * Handle click events for music and sound images.
     * @param {*} event
     */
    handleClick(event) {
        const { offsetX, offsetY } = event;
        const rect = this.ui.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        // Check if the click is within the music image bounds
        const { musicImage, soundImage } = this.settings;

        // Check if the interaction is within the music image bounds
        if (
            x >= musicImage.x &&
            x <= musicImage.x + musicImage.width &&
            y >= musicImage.y &&
            y <= musicImage.y + musicImage.height
        ) {
            console.log('Music image clicked or touched');
            this.settings.toggleMusicVolume();
        }

        // Check if the interaction is within the sound image bounds
        if (
            x >= soundImage.x &&
            x <= soundImage.x + soundImage.width &&
            y >= soundImage.y &&
            y <= soundImage.y + soundImage.height
        ) {
            console.log('Sound image clicked or touched');
            this.settings.toggleSoundVolume();
        }
    }
}