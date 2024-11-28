import { World } from "../world.class.js";

export class Menu extends World {
    constructor(currentMenu) {
        super();
        this.currentMenu = currentMenu;
    }

    changeMenu(newMenu) {
        if (this.currentMenu && this.currentMenu.onExit) {
            this.currentMenu.onExit();
        }
        this.currentMenu = newMenu;
        if (this.currentMenu && this.currentMenu.onEnter) {
            this.currentMenu.onStart();
        }
    }

    Update(deltaTime) {
        //if(!this.currentMenu.menuActive) return;
        if (this.currentMenu && this.currentMenu.onUpdate) {
            this.currentMenu.onUpdate(deltaTime);
        }
        //console.log('test');
        
    }

    setFont(fontSize) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${fontSize} Boogaloo`;
        this.ctx.textAlign = 'center';
    }

    menuKeyInputInStartMenu() {
        const input = this.inputHandler.getInput();
        if (input.up) this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        else if (input.down) this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        else if (!this.onStart && input.enter) this.startMenu();
        else if (this.onStart && input.any) {
            this.menuActive = true;
            this.onStart = false;
            this.layer = 0;
        }
        this.drawStartMenu();
    }
    
    menuKeyInputInGameMenu() {
        const input = this.inputHandler.getInput();
        if (input.up) this.selectedOption = (this.selectedOption - 1 + this.inGameMenuOptions.length) % this.inGameMenuOptions.length;
        else if (input.down) this.selectedOption = (this.selectedOption + 1) % this.inGameMenuOptions.length;
        else if (input.enter) this.inGameMenu();
        this.drawInGameMenu();
    }
    
    handleMenuKeyInput(event) {
        if (!this.menuActive && !this.onStart) return;
        const input = this.inputHandler.getInput();
    
        switch (this.layer) {
            case 0: this.menuKeyInputInStartMenu(); break;
            case 1: this.menuKeyInputInGameMenu(); break;
            case 2: // Settings-Menü
                this.handleSettingsInput(event);
                this.drawSettingsMenu();
                break;
        }
    }
    
    handleSettingsInput(event) {
        const currentOption = this.settingsOptions[this.selectedOption];
        this.global.getVolumes();
        if (event.key === 'ArrowUp') {
            this.selectedOption = (this.selectedOption - 1 + this.settingsOptions.length) % this.settingsOptions.length;
        } else if (event.key === 'ArrowDown') {
            this.selectedOption = (this.selectedOption + 1) % this.settingsOptions.length;
        } else if (event.key === 'ArrowLeft' && currentOption.type === 'slider') {
            currentOption.value = Math.max(0, currentOption.value - 0.1); // Reduziert den Wert
            if (currentOption.label === "Music Volume") this.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.global.setSoundVolumes(currentOption.value);
        } else if (event.key === 'ArrowRight' && currentOption.type === 'slider') {
            currentOption.value = Math.min(1, currentOption.value + 0.1); // Erhöht den Wert
            if (currentOption.label === "Music Volume") this.global.setMusicVolumes(currentOption.value);
            else if (currentOption.label === "Sound Volume") this.global.setSoundVolumes(currentOption.value);
            //this.global.audioManager.updateVolumes();
        } else if (event.key === 'Enter' && currentOption.type === 'toggle') {
            currentOption.value = !currentOption.value; // Umschalten
            this.global.setMusicOn(currentOption.value);
        }
        else if (event.key === 'Enter' && currentOption.type === 'button') {
            this.lastLayer == 1 ? this.layer = 1 : this.layer = 0;
            this.selectedOption = 1;
            this.drawInGameMenu();
        }
        else if (event.key === 'Escape') {
            this.lastLayer == 1 ? this.layer = 1 : this.layer = 0;
            this.drawInGameMenu();
        }
    }
    
    
    
    handleMenuMouseInput(event) {
        if (!this.menuActive) return;
    
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        if (this.layer === 0) { // Startmenü
            this.menuOptions.forEach((option, index) => {
                const y = this.canvas.height / 2 - 70 + index * 80;
                if (mouseX > this.canvas.width / 2 - 150 && mouseX < this.canvas.width / 2 + 150 &&
                    mouseY > y - 20 && mouseY < y + 20) {
                    this.selectedOption = index;
                    this.startMenu();
                }
            });
        } else if (this.layer === 1) { // In-Game-Menü
            this.inGameMenuOptions.forEach((option, index) => {
                const y = this.canvas.height / 2 + index * 40;
                if (mouseX > this.canvas.width / 2 - 150 && mouseX < this.canvas.width / 2 + 150 &&
                    mouseY > y - 20 && mouseY < y + 20) {
                    this.selectedOption = index;
                    this.inGameMenu();
                }
            });
        } else if (this.layer === 2) { // Settings-Menü
            this.settingsOptions.forEach((option, index) => {
                const y = 170 + index * 80;
    
                if (option.type === 'slider') {
                    const sliderX = this.canvas.width / 2 - 100;
                    const sliderY = y + 10;
                    const sliderWidth = 200;
    
                    if (mouseX > sliderX && mouseX < sliderX + sliderWidth &&
                        mouseY > sliderY - 10 && mouseY < sliderY + 20) {
                        const newValue = (mouseX - sliderX) / sliderWidth;
                        option.value = Math.min(1, Math.max(0, newValue));
                        this.applySettings(option.label, option.value);
                    }
                } else if (option.type === 'toggle' &&
                    mouseX > this.canvas.width / 2 - 150 && mouseX < this.canvas.width / 2 + 150 &&
                    mouseY > y - 20 && mouseY < y + 20) {
                    option.value = !option.value;
                    this.applySettings(option.label, option.value);
                }
            });
    
            // "Back"-Option
            const backY = this.canvas.height - 70;
            if (mouseX > this.canvas.width / 2 - 150 && mouseX < this.canvas.width / 2 + 150 &&
                mouseY > backY - 20 && mouseY < backY + 20) {
                this.layer = this.lastLayer;
                this.menuActive = true;
                this.selectedOption = 0;
                this.layer === 1 ? this.drawInGameMenu() : this.drawStartMenu();
            }
        }
    }
    
    applySettings(label, value) {
        if (label === 'Music Volume') {
            this.global.audioManager.musicVolume = value;
        } else if (label === 'Sound Volume') {
            this.global.audioManager.effectsVolume = value;
        } else if (label === 'Music On/Off') {
            this.global.audioManager.musicOn = value;
            if (value) {
                this.global.audioManager.playMusic('El Pollo Loco');
            } else {
                this.global.audioManager.stopMusic('El Pollo Loco');
            }
        }
    }

    executeMenuOption() {
        if (this.onStart) return;
    
        this.menuActive = true;
        this.global.pause = true;
        if (this.layer === 0) this.startMenu();
        else this.inGameMenu();
    }
    
    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.handleMenuKeyInput(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
    
        window.addEventListener('keydown', this.keyListener);
        this.canvas.addEventListener('click', this.mouseListener);
    }
    
    removeMenuListeners() {
        if (this.keyListener) {
            window.removeEventListener('keydown', this.keyListener);
    
            this.keyListener = null;
        }
        if (this.mouseListener) {
            this.canvas.removeEventListener('click', this.mouseListener);
            this.mouseListener = null;
        }
    }
    
    
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}