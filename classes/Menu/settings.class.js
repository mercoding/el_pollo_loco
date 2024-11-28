import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Settings {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
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
        this.startMenuBackground.src = "img/wood.jpg";
        this.ui.menuActive = true;
        this.addMenuListeners();
    }

    onUpdate(deltaTime) {
        this.drawSettingsMenu();
    }

    onExit() {
        this.removeMenuListeners();
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

    drawSettingsMenu() {
        // Hintergrund zeichnen
        if (this.ui.global.inGame) {
            this.ui.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        } else {
            this.drawBackground(this.background);
            this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 200, 300, 400, 20, "transparent", 2, 0.85);
        }

        // Menü-Optionen zeichnen
        this.ui.ctx.font = '30px Boogaloo';
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.textAlign = 'center';

        this.ui.ctx.fillText("Settings", this.ui.canvas.width / 2, 90);

        this.settingsOptions.forEach((option, index) => {
            const y = 170 + index * 80;
            const isSelected = this.selectedOption === index;

            if (option.type === 'slider') {
                const sliderX = this.ui.canvas.width / 2 - 100;
                const sliderY = y + 10;
                const sliderWidth = 200;

                this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ui.ctx.fillText(option.label, this.ui.canvas.width / 2, y - 5);

                this.ui.ctx.fillStyle = 'grey';
                this.ui.ctx.fillRect(sliderX, sliderY, sliderWidth, 10);

                const handleX = sliderX + option.value * sliderWidth;
                this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ui.ctx.beginPath();
                this.ui.ctx.arc(handleX, sliderY + 5, 8, 0, Math.PI * 2);
                this.ui.ctx.fill();
            } else if (option.type === 'toggle') {
                this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                const status = option.value ? 'On' : 'Off';
                this.ui.ctx.fillText(`${option.label}: ${status}`, this.ui.canvas.width / 2, y);
            }
            else if (option.type === 'button') {
                // "Back"-Option zeichnen
                const backY = this.ui.canvas.height - 70;
                this.ui.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ui.ctx.fillText("Back", this.ui.canvas.width / 2, backY);
            }
        });
    }

    executeMenuOption() {
        //if (this.onStart) return;

        this.ui.menuActive = true;
        this.ui.global.pause = true;
        if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
        else this.ui.menu.changeMenu(new GameMenu(this.ui));

    }

    handleSettingsInput(event) {
        const currentOption = this.settingsOptions[this.selectedOption];
        this.ui.global.getVolumes();
        if (event.key === 'ArrowUp') {
            this.selectedOption = (this.selectedOption - 1 + this.settingsOptions.length) % this.settingsOptions.length;
        } else if (event.key === 'ArrowDown') {
            this.selectedOption = (this.selectedOption + 1) % this.settingsOptions.length;
        } else if (event.key === 'ArrowLeft' && currentOption.type === 'slider') {
            currentOption.value = Math.max(0, currentOption.value - 0.1); // Reduziert den Wert
            if (currentOption.label === "Music Volume") this.ui.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.ui.global.setSoundVolumes(currentOption.value);
        } else if (event.key === 'ArrowRight' && currentOption.type === 'slider') {
            currentOption.value = Math.min(1, currentOption.value + 0.1); // Erhöht den Wert
            if (currentOption.label === "Music Volume") this.ui.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.ui.global.setSoundVolumes(currentOption.value);
            //this.global.audioManager.updateVolumes();
        } else if (event.key === 'Enter' && currentOption.type === 'toggle') {
            currentOption.value = !currentOption.value; // Umschalten
            this.ui.global.setMusicOn(currentOption.value);
        }
        else if (event.key === 'Enter' && currentOption.type === 'button') {
            this.lastLayer == 1 ? this.layer = 1 : this.layer = 0;
            this.selectedOption = 1;
            if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
            else this.ui.menu.changeMenu(new GameMenu(this.ui));

        }
        else if (event.key === 'Escape') {
            this.lastLayer == 1 ? this.layer = 1 : this.layer = 0;
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    handleSlider(option, mouseX, mouseY, y) {
        if (option.type === 'slider') {
            const sliderX = this.ui.canvas.width / 2 - 100;
            const sliderY = y + 10;
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
            mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
            mouseY > y - 20 && mouseY < y + 20) {
            option.value = !option.value;
            this.applySettings(option.label, option.value);
        }
    }

    handleButton(option, mouseX, mouseY) {
        const backY = this.ui.canvas.height - 70;
        if ((option.type === 'button') && mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
            mouseY > backY - 20 && mouseY < backY + 20) {
            this.ui.menuActive = true;
            this.applySettings(option.label, option.value);
            this.selectedOption = 0;
        }
    }

    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Settings-Menü
        this.settingsOptions.forEach((option, index) => {
            const y = 170 + index * 80;
            this.handleSlider(option, mouseX, mouseY, y);
            this.handleToggle(option, mouseX, mouseY, y);
            this.handleButton(option, mouseX, mouseY);
        });
    }

    applySettings(label, value) {
        if (label === 'Music Volume') {
            this.ui.global.audioManager.musicVolume = value;
        } else if (label === 'Sound Volume') {
            this.ui.global.audioManager.effectsVolume = value;
        } else if (label === 'Music On/Off') {
            this.ui.global.audioManager.musicOn = value;
            if (value) {
                this.ui.global.audioManager.playMusic('El Pollo Loco');
            } else {
                this.ui.global.audioManager.stopMusic('El Pollo Loco');
            }
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

        window.addEventListener('keydown', this.keyListener);
        this.ui.canvas.addEventListener('click', this.mouseListener);
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

    clearCanvas() {
        this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }
}