import { InputHandler } from "./inputHandler.class.js";
import { World } from "./world.class.js";

export class UI extends World {
    startBackground = new Image();
    startMenuBackground = new Image();
    healthStatusBar = new Image();
    bottlesStatusBar = new Image();
    bossStatusBar = new Image();
    coinsStatus = new Image();
    gameOverImg = new Image();
    gameWinImg = new Image();
    healthStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png' },
        20: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png' },
        40: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png' },
        60: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png' },
        80: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png' },
        100: { path: 'img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png' }
    };

    bottleStatus = {
        0: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png' },
        20: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png' },
        40: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png' },
        60: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png' },
        80: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png' },
        100: { path: 'img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png' }
    };



    constructor(global, game, musicVolume, effectsVolume) {
        super();
        this.game = game;
        this.menuActive = false; // Menü ist zunächst deaktiviert
        this.global = global;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.selectedOption = 0;
        this.inputHandler = new InputHandler();
        this.layer = 0;
        this.lastLayer = 0;
        this.musicVolume = musicVolume;
        this.effectsVolume = effectsVolume;
        this.Start();
    }


    Start() {
        this.showPressAnyKey = true; // Zeigt den "Press Any Key"-Text
        this.blinkTimer = 0; // Timer für das Blinken
        this.startBackground.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.startMenuBackground.src = "img/wood.jpg";
        this.menuOptions = ['New Game', 'Settings', 'Quit']; // Menüoptionen
        this.inGameMenuOptions = ['Resume', 'Settings', 'Exit'];
        this.settingsOptions = [
            { label: 'Music On/Off', type: 'toggle', value: this.global.getMusicOn() },
            { label: 'Music Volume', type: 'slider', value: this.global.getMusicVolumes() },
            { label: 'Sound Volume', type: 'slider', value: this.global.getSoundVolumes() },
            { label: 'Back', type: 'button' },
        ];
        this.global.audioManager.musicVolume = this.musicVolume;
        this.global.audioManager.effectsVolume = this.effectsVolume;
        //this.pressAnyKeyListener = this.handlePressAnyKey.bind(this); // Speichere die gebundene Funktion
        this.onStart = true;
        this.setFont();
        this.gameOverImg.src = "img/9_intro_outro_screens/game_over/you lost.png";
        this.gameWinImg.src = "img/9_intro_outro_screens/win/won_1.png";

        // Listener für "Press Any Key"
        //if(this.onStart) document.addEventListener('keydown', this.pressAnyKeyListener, { once: true });
    }

    Update(deltaTime) {
        if (this.onStart && !this.menuActive) {
            this.drawPressAnyKey(deltaTime);
        } else if (this.menuActive) {
            
            //this.handleMenuInput(deltaTime);
            //window.removeEventListener('keydown', this.handlePressAnyKey.bind(this), { showPressAnyKey: true });

            if (this.layer === 0) this.drawStartMenu();
            else if (this.layer === 1) this.drawMenu(); // Menü aktualisieren
            else if (this.layer === 2) this.drawSettingsMenu();
        }
    }

    
    


    handlePressAnyKey() {
        this.showPressAnyKey = false;
        this.menuActive = true; // Menü aktivieren
        this.layer = 0; // Startmenü anzeigen
        window.removeEventListener('keydown', this.pressAnyKeyListener);
        this.onStart = false;

        this.addMenuListeners();
        this.drawStartMenu();
    }

    drawPressAnyKey(deltaTime) {
        this.blinkTimer += deltaTime;
        const blink = Math.floor(this.blinkTimer * 2) % 2 === 0; // Einfache Blinklogik

        this.clearCanvas();
        this.drawBackground(this.startBackground);

        if (blink) {
            this.ctx.font = '40px Boogaloo';
            this.ctx.fillStyle = 'white';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("Press Any Key", this.canvas.width / 2, this.canvas.height / 2 + 220);
        }
    }

    drawHealthBar(percent, x, y) {
        this.healthStatusBar.src = percent > 0 ? this.healthStatus[percent].path : this.healthStatus['0'].path;
        this.ctx.drawImage(this.healthStatusBar, x, y, 200, 50);
    }


    drawBottleBar(percent, x, y) {
        this.bottlesStatusBar.src = this.bottleStatus[percent].path;
        this.ctx.drawImage(this.bottlesStatusBar, x, y, 200, 50);
    }

    drawCoinStatusBar(coins, x, y) {
        this.coinsStatus.src = 'img/7_statusbars/3_icons/icon_coin.png';
        this.ctx.drawImage(this.coinsStatus, x, y, 50, 50);
        this.ctx.font = '30px "Boogaloo"';
        this.ctx.fillStyle = 'white'; //
        const tx = x > 99 ? x + 5 : x;
        this.ctx.fillText(`${coins}`, x + 55, y + 35);
    }

    toggleMenu() {
        if (this.layer != 1) return;
        this.menuActive = !this.menuActive;
        this.global.pause = this.menuActive;
        this.selectedOption = 0; // Zurücksetzen der Auswahl

        if (this.menuActive) {
            this.global.audioManager.stopAll();
            this.addMenuListeners();
            this.layer === 2 ? this.drawSettingsMenu : this.layer === 0 ? this.drawStartMenu() : this.drawMenu();
        } else {
            if (this.global.musicOn())
                this.global.audioManager.playMusic('El Pollo Loco');
            this.removeMenuListeners();
        }
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


    drawBackground(background) {
        this.clearCanvas();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(background, 0, 0, this.canvas.width, this.canvas.height);
    }

    

    drawGameOver() {
        const gameOver = this.global.health <= 0 ? this.gameOverImg : this.gameWinImg;
        if(this.global.health <= 0) this.ctx.drawImage(gameOver, 0, 0, this.canvas.width, this.canvas.height);
        else this.ctx.drawImage(gameOver, this.canvas.width / 2 - 200, this.canvas.height / 2 - 75, 400, 150);
        this.global.gameOver = true;
        //this.global.pause = true;
    }

    setFont() {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '30px Boogaloo';
        this.ctx.textAlign = 'center';
    }

    drawStartMenu() {
        this.lastLayer = 0;
        this.drawBackground(this.startBackground);
        this.drawImageWithRoundedBorder(this.ctx, this.startMenuBackground, this.canvas.width / 2 - 150, this.canvas.height / 2 - 200, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        const title = "Main Menu";
        this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2 - 150);

        // Menüoptionen zeichnen
        this.menuOptions.forEach((option, index) => {
            const y = this.canvas.height / 2 - 70 + index * 80;
            this.ctx.fillStyle = this.selectedOption === index ? 'yellow' : 'white'; // Highlight
            if (option === "Quit") this.ctx.fillText(option, this.canvas.width / 2, y + 80);
            else this.ctx.fillText(option, this.canvas.width / 2, y);
        });
    }


    updateInGameMenuOptions() {
        if (this.global.gameOver) {
            this.inGameMenuOptions = ['New Game', 'Settings', 'Exit'];
        } else {
            this.inGameMenuOptions = ['Resume', 'Settings', 'Exit'];
        }
    }

    drawMenu() {
        this.updateInGameMenuOptions(); // Optionen basierend auf dem Zustand aktualisieren
        this.lastLayer = 1;
    
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
        this.setFont();
    
        const title = this.global.gameOver ? "Game Over" : "In-Game Menu";
        this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2 - 100);
    
        // Menüoptionen zeichnen
        this.inGameMenuOptions.forEach((option, index) => {
            const y = this.canvas.height / 2 + index * 40;
            if (index === this.selectedOption) {
                this.ctx.fillStyle = 'yellow';
                this.ctx.fillText(option, this.canvas.width / 2, y);
            } else {
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(option, this.canvas.width / 2, y);
            }
        });
    }
    


    handleMenuKeyInput(event) {
        if (!this.menuActive && !this.onStart) return;
        const input = this.inputHandler.getInput();        

        switch (this.layer) {
            case 0: // Startmenü
                if (input.up) {
                    this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
                } else if (input.down) {
                    this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
                } else if (!this.onStart && input.enter) {                    
                    this.startMenu();
                }
                else if(this.onStart && input.any) {
                    this.menuActive = true;
                    this.onStart = false;
                    this.layer = 0;            
                }
                this.drawStartMenu();
                break;

            case 1: // In-Game-Menü
                if (input.up) {
                    this.selectedOption = (this.selectedOption - 1 + this.inGameMenuOptions.length) % this.inGameMenuOptions.length;
                } else if (input.down) {
                    this.selectedOption = (this.selectedOption + 1) % this.inGameMenuOptions.length;
                } else if (input.enter) {
                    this.inGameMenu();
                }
                this.drawMenu();
                break;

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
            this.drawMenu();
        }
        else if (event.key === 'Escape') {
            this.lastLayer == 1 ? this.layer = 1 : this.layer = 0;
            this.drawMenu();
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
                this.layer === 1 ? this.drawMenu() : this.drawStartMenu();
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
    
    


    inGameMenu() {
        const selected = this.inGameMenuOptions[this.selectedOption];
    
        if (selected === 'Resume' && !this.global.gameOver) {
            this.menuActive = false;
            this.global.pause = false;
            this.layer = 1;
            this.game.resume();
        } else if (selected === 'New Game') {
            this.menuActive = false;
            this.global.pause = false;
            this.global.gameOver = false;
            this.global.health = 100; // Spielerstatus zurücksetzen
            this.global.coins = 0;
            this.global.bossDefeated = 0;
            this.game.Start(); // Neues Spiel starten
        } else if (selected === 'Settings') {
            this.layer = 2; // Wechsel ins Settings-Menü
            this.drawSettingsMenu();
        } else if (selected === 'Exit') {
            this.global.inGame = false;
            this.menuActive = true;
            this.global.pause = true;
            this.selectedOption = 0;
            this.layer = 0;
            this.drawStartMenu();
        }
    }
    

    startMenu() {
        if(this.onStart) return;
        this.lastLayer = 0;
        const selected = this.menuOptions[this.selectedOption];

        if (selected === 'New Game') {
            this.global.inGame = true;
            this.menuActive = false;
            this.global.pause = false;
            window.removeEventListener('keydown', this.pressAnyKeyListener);
            this.game.Start();
            //this.layer = 0;
        } else if (selected === 'Settings') {
            this.layer = 2; // Wechsel ins Settings-Menü
            this.drawSettingsMenu();
        } else if (selected === 'Quit') {
            this.global.inGame = false;
            this.menuActive = false;
            this.onStart = true;
            this.selectedOption = 0;
            this.layer = 0;
        }
    }


    drawSettingsMenu() {
        // Hintergrund zeichnen
        if (this.global.inGame) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.drawBackground(this.startBackground);
            this.drawImageWithRoundedBorder(this.ctx, this.startMenuBackground, this.canvas.width / 2 - 150, this.canvas.height / 2 - 200, 300, 400, 20, "transparent", 2, 0.85);
        }
    
        // Menü-Optionen zeichnen
        this.ctx.font = '30px Boogaloo';
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'center';
    
        this.ctx.fillText("Settings", this.canvas.width / 2, 90);
    
        this.settingsOptions.forEach((option, index) => {
            const y = 170 + index * 80;
            const isSelected = this.selectedOption === index;
    
            if (option.type === 'slider') {
                const sliderX = this.canvas.width / 2 - 100;
                const sliderY = y + 10;
                const sliderWidth = 200;
    
                this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ctx.fillText(option.label, this.canvas.width / 2, y - 5);
    
                this.ctx.fillStyle = 'grey';
                this.ctx.fillRect(sliderX, sliderY, sliderWidth, 10);
    
                const handleX = sliderX + option.value * sliderWidth;
                this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ctx.beginPath();
                this.ctx.arc(handleX, sliderY + 5, 8, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (option.type === 'toggle') {
                this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                const status = option.value ? 'On' : 'Off';
                this.ctx.fillText(`${option.label}: ${status}`, this.canvas.width / 2, y);
            }
            else if(option.type === 'button') {
                 // "Back"-Option zeichnen
                const backY = this.canvas.height - 70;
                this.ctx.fillStyle = isSelected ? 'yellow' : 'white';
                this.ctx.fillText("Back", this.canvas.width / 2, backY);
            }
        });
    }
    







    executeMenuOption() {
        if(this.onStart) return;

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