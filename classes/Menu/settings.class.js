import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Settings {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.buttonBackground = new Image();
        this.musicImage = new Image();
        this.soundImage = new Image();
        this.selectedOption = 0;
        this.onStart();
    }

    onStart() {
        this.settingsOptions = [
            { label: 'Music On/Off', type: 'toggle', value: this.ui.global.getMusicOn() },
            { label: 'Music Volume', type: 'slider', value: this.ui.global.getMusicVolumes() },
            { label: 'Sound Volume', type: 'slider', value: this.ui.global.getSoundVolumes() },
            { label: 'Back', type: 'button' },
        ];
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.startMenuBackground.src = "img/ui/panel.png";
        this.buttonBackground.src = "img/ui/button.png";
        this.musicImage.src = 'img/ui/Music.png';
        this.soundImage.src = 'img/ui/Sound.png';
        this.buttonPositions = this.settingsOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 110,
            y: this.ui.canvas.height / 2 - (index * 70),
            width: 200,
            height: 50,
        }));

        this.ui.menuActive = true;
        this.addMenuListeners();
    }

    onUpdate(deltaTime) {
        this.drawSettingsMenu();
        this.updateUIPositions();
    }

    onExit() {
        this.removeMenuListeners();
        this.ui.canvas.style.cursor = 'default';
    }

    setFont() {
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.font = '30px Boogaloo';
        this.ui.ctx.textAlign = 'center';
    }

    drawBackground(background) {
        this.clearCanvas();
        this.ui.ctx.fillStyle = 'black';
        this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        this.ui.ctx.drawImage(background, 0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    drawRoundedBox(ctx, x, y, width, height, borderRadius) {
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
    }

    drawImageWithRoundedBorder(ctx, image, x, y, width, height, borderRadius = 20, borderColor = 'black', borderWidth = 2, alpha = 1) {
        ctx.save();
        ctx.globalAlpha = alpha;
        this.drawRoundedBox(ctx, x, y, width, height, borderRadius);
        ctx.clip();
        ctx.drawImage(image, x, y, width, height);
        ctx.restore();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.restore();
    }



    drawSlider(option, isSelected, y) {
        if (option.type === 'slider') {
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            option.label === 'Music Volume' ? this.ui.ctx.drawImage(this.musicImage, this.ui.canvas.width / 2 - 80, y - 30, 40, 40) : this.ui.ctx.drawImage(this.soundImage, this.ui.canvas.width / 2 - 75, y - 28, 35, 35);
            const sliderX = this.ui.canvas.width / 2 - 30;
            const sliderY = y - 15;
            const sliderWidth = 100;
            this.ui.ctx.fillStyle = 'grey';
            this.ui.ctx.fillRect(sliderX, sliderY, sliderWidth, 10);
            const handleX = sliderX + option.value * sliderWidth;
            this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ui.ctx.beginPath();
            this.ui.ctx.arc(handleX, sliderY + 5, 8, 0, Math.PI * 2);
            this.ui.ctx.fill();
        }
    }

    drawToggle(option, isSelected, y) {
        if (option.type === 'toggle') {
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            const status = option.value ? 'On' : 'Off';
            this.ui.ctx.fillText(`Music: `, this.ui.canvas.width / 2 - 20, y);
            this.ui.ctx.fillText(`${status}`, this.ui.canvas.width / 2 + 35, y);
        }
    }

    drawButton(option, isSelected, y) {
        if (option.type === 'button') {
            // "Back"-Option zeichnen
            const backY = this.ui.canvas.height - 70;
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 35, 200, 50, 20);
            this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
            this.ui.ctx.fillText("Back", this.ui.canvas.width / 2, y);
        }
    }

    drawSettingsOptions() {
        this.settingsOptions.forEach((option, index) => {
            //const y = 170 + index * 80;
            const y = this.ui.canvas.height / 2 - 70 + index * 70;

            const isSelected = this.selectedOption === index;
            this.drawToggle(option, isSelected, y);
            this.drawSlider(option, isSelected, y);
            this.drawButton(option, isSelected, y);
        });
    }

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

    executeMenuOption() {
        this.ui.menuActive = true;
        this.ui.global.pause = true;
        if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
        else this.ui.menu.changeMenu(new GameMenu(this.ui));

    }

    handleArrowKeyInput(event, currentOption) {
        if (event.key === 'ArrowUp') this.selectedOption = (this.selectedOption - 1 + this.settingsOptions.length) % this.settingsOptions.length;
        else if (event.key === 'ArrowDown') this.selectedOption = (this.selectedOption + 1) % this.settingsOptions.length;
        else if (event.key === 'ArrowLeft' && currentOption.type === 'slider') {
            currentOption.value = Math.max(0, currentOption.value - 0.1); // Reduziert den Wert
            if (currentOption.label === "Music Volume") this.ui.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.ui.global.setSoundVolumes(currentOption.value);
        }
        else if (event.key === 'ArrowRight' && currentOption.type === 'slider') {
            currentOption.value = Math.min(1, currentOption.value + 0.1); // Erhöht den Wert
            if (currentOption.label === "Music Volume") this.ui.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.ui.global.setSoundVolumes(currentOption.value);
        }
    }

    handleEnterKeyInput(event, currentOption) {
        if (event.key === 'Enter' && currentOption.type === 'toggle') {
            currentOption.value = !currentOption.value; // Umschalten
            this.ui.global.setMusicOn(currentOption.value);
        }
        else if (event.key === 'Enter' && currentOption.type === 'button') {
            this.selectedOption = 1;
            if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
            else this.ui.menu.changeMenu(new GameMenu(this.ui));

        }
    }

    handleEscapeKeyInput(event) {
        if (event.key === 'Escape') {
            this.ui.global.inGame ? this.ui.menu.changeMenu(new GameMenu(this.ui)) : this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    handleSettingsInput(event) {
        const currentOption = this.settingsOptions[this.selectedOption];
        this.ui.global.getVolumes();
        this.handleArrowKeyInput(event, currentOption);
        this.handleEnterKeyInput(event, currentOption);
        this.handleEscapeKeyInput(event);
    }

    handleSlider(option, mouseX, mouseY, y) {
        if (option.type === 'slider') {
            const sliderX = this.ui.canvas.width / 2 - 100;
            const sliderY = y - 10;
            const sliderWidth = 200;

            if (mouseX > sliderX && mouseX < sliderX + sliderWidth &&
                mouseY > sliderY - 10 && mouseY < sliderY + 20) {
                const newValue = (mouseX - sliderX) / sliderWidth;
                option.value = Math.min(1, Math.max(0, newValue));
                this.applySettings(option.label, option.value);
            }
        }
    }

    handleToggle(option, mouseX, mouseY, y) {
        if (option.type === 'toggle' &&
            mouseX > this.ui.canvas.width / 2 - 100 && mouseX < this.ui.canvas.width / 2 + 100 &&
            mouseY > y - 40 && mouseY < y + 20) {
            option.value = !option.value;
            this.applySettings(option.label, option.value);
        }
    }

    handleButton(option, mouseX, mouseY, y) {
        if (option.type === 'button' &&
            mouseX > this.ui.canvas.width / 2 - 100 && mouseX < this.ui.canvas.width / 2 + 100 &&
            mouseY > y - 40 && mouseY < y + 20) {
            this.ui.menuActive = true;
            this.applySettings(option.label, option.value);
        }
    }

    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        // Settings-Menü
        this.settingsOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 - 70 + index * 70;
            this.handleSlider(option, mouseX, mouseY, y);
            this.handleToggle(option, mouseX, mouseY, y);
            this.handleButton(option, mouseX, mouseY, y);
        });
    }


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

    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.handleSettingsInput(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
        this.mouseHoverListener = (event) => this.handleMouseHover(event);


        window.addEventListener('keydown', this.keyListener);
        this.ui.canvas.addEventListener('click', this.mouseListener);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
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

    clearCanvas() {
        this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    drawRoundedButton(ctx, x, y, width, height, radius) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = '#3498db';
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fill();
    }

    handleMouseHover(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        let isHovering = false;

        this.buttonPositions.forEach((button, index) => {
            if (
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height
            ) {
                isHovering = true;
                this.selectedOption = index;
            }
        });

        this.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }

    updateUIPositions() {
        this.buttonPositions = this.settingsOptions.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 100,
            y: this.ui.canvas.height / 2 - 110 + index * 70,
            width: 200,
            height: 50,
        }));
    }
}