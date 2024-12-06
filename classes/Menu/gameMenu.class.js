import { InputHandler } from "../inputHandler.class.js";
import { ClosedMenu } from "./closedMenu.class.js";
import { Settings } from "./settings.class.js";
import { StartMenu } from "./startMenu.class.js";

export class GameMenu {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
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
        this.ui.global.audioManager.musicVolume = this.ui.global.getMusicVolumes();
        this.ui.global.audioManager.effectsVolume = this.ui.global.getSoundVolumes();
        this.ui.global.pause = true;
        this.ui.global.inGame = true;
        this.addMenuListeners();
    }

    onUpdate(deltaTime) {
        this.drawInGameMenu();
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

    updateInGameMenuOptions() {
        if (this.ui.global.gameOver) {
            this.inGameMenuOptions = ['New Game', 'Settings', 'Exit'];
        } else {
            this.inGameMenuOptions = ['Resume', 'Settings', 'Exit'];
        }
    }

    drawInGameMenuOptions() {
        // Menüoptionen zeichnen
        this.inGameMenuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 + index * 40;
            if (index === this.selectedOption) {
                this.ui.ctx.fillStyle = 'yellow';
                this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
            } else {
                this.ui.ctx.fillStyle = 'white';
                this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
            }
        });
    }

    drawInGameMenu() {
        this.updateInGameMenuOptions(); // Optionen basierend auf dem Zustand aktualisieren
        this.lastLayer = 1;
        this.ui.ctx.save();
        this.ui.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        this.ui.ctx.restore();
        this.setFont();
        const title = this.ui.global.gameOver ? "Game Over" : "In-Game Menu";
        this.ui.ctx.fillText(title, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 100);
        this.drawInGameMenuOptions();
    }

    menuKeyInputInGameMenu(event) {
        const input = this.inputHandler.getInput();
        if (input.up) this.selectedOption = (this.selectedOption - 1 + this.inGameMenuOptions.length) % this.inGameMenuOptions.length;
        else if (input.down) this.selectedOption = (this.selectedOption + 1) % this.inGameMenuOptions.length;
        else if (input.enter) this.inGameMenu();
        this.drawInGameMenu();
    }


    handleMenuMouseOptions(mouseX, mouseY) {
        // In-Game-Menü
        this.inGameMenuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 + index * 40;
            if (mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
                mouseY > y - 20 && mouseY < y + 20) {
                this.selectedOption = index;
                this.inGameMenu();
            }
        });
    }

    handleMenuMouseBackButton(mouseX, mouseY) {
        // "Back"-Option
        const backY = this.ui.canvas.height - 70;
        if (mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
            mouseY > backY - 20 && mouseY < backY + 20) {
            this.layer = this.lastLayer;
            this.ui.menuActive = true;
            this.selectedOption = 0;
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }


    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        this.handleMenuMouseOptions(mouseX, mouseY);
        this.handleMenuMouseBackButton(mouseX, mouseY);
    }

    applySettings(label, value) {
        if (label === 'Music Volume') this.ui.global.audioManager.musicVolume = value;
        else if (label === 'Sound Volume') this.ui.global.audioManager.effectsVolume = value;
        else if (label === 'Music On/Off') {
            this.ui.global.audioManager.musicOn = value;
            if (value) this.ui.global.audioManager.playMusic('El Pollo Loco');
            else this.ui.global.audioManager.stopMusic('El Pollo Loco');
        }
        else if(label === "Exit") this.ui.menu.changeMenu(new StartMenu(this.ui));
    }

    Resume(selected) {
        if (selected === 'Resume' && !this.ui.global.gameOver) {
            this.ui.global.inGame = true;
            this.ui.menuActive = false;
            this.ui.global.pause = false;
            this.layer = 1;
            this.ui.menu.changeMenu(new ClosedMenu(this.ui));
        } 
    }

    NewGame(selected) {
        if (selected === 'New Game') {
            this.ui.global.inGame = true;
            this.ui.menuActive = false;
            this.ui.global.pause = false;
            this.ui.menu.changeMenu(new ClosedMenu(this.ui));
            this.ui.game.StartGame();
        } 
    }


    Settings(selected) {
        if (selected === 'Settings') {
            this.layer = 2; // Wechsel ins Settings-Menü
            this.selectedOption = 0;
            this.ui.menuActive = true;
            this.ui.global.pause = true;
            this.ui.menu.changeMenu(new Settings(this.ui));
        }
    }

    Exit(selected) {
        if (selected === 'Exit') {
            this.ui.global.inGame = false;
            this.ui.menuActive = true;
            this.ui.global.pause = true;
            this.selectedOption = 0;
            this.layer = 0;
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }



    inGameMenu() {
        const selected = this.inGameMenuOptions[this.selectedOption];
        this.Resume(selected);
        this.NewGame(selected);
        this.Settings(selected);
        this.Exit(selected);
    }

    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.menuKeyInputInGameMenu(event);
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

    handleMouseHover(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        let isHovering = false;
    
        this.inGameMenuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 + index * 40;
            if (mouseX > this.ui.canvas.width / 2 - 50 && mouseX < this.ui.canvas.width / 2 + 50 &&
                mouseY > y - 20 && mouseY < y + 10) {
                isHovering = true;
                this.selectedOption = index;
            }
        });
    
        // Setze den Cursor basierend auf Hover-Zustand
        this.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }
}