import { InputHandler } from "../inputHandler.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Intro {
    constructor(ui) {
        this.ui = ui;
        this.background = new Image();
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.blinkTimer = 0; // Timer für das Blinken
        this.ui.global.audioManager.stopAll(); 
        this.inputHandler = new InputHandler();
        this.onStart();
    }

    onStart() {
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.blinkTimer = 0; // Timer für das Blinken
        this.ui.global.audioManager.stopAll();        
    }

    onUpdate(deltaTime) {
        this.drawPressAnyKey(deltaTime);
        this.handleAnyKeyInput();        
    }

    onExit() {
        //this.removeMenuListeners();
    }

    setFont() {
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.font = `40px Boogaloo`;
        this.ui.ctx.textAlign = 'center';
    }

    handleAnyKeyInput() {
        const input = this.inputHandler.getInput();
        if (input.any) {
            
            this.ui.menu.changeMenu(new StartMenu(this.ui)); 
        }

    }

    drawBackground(background) {
        this.clearCanvas();
        this.ui.ctx.fillStyle = 'black';
        this.ui.ctx.fillRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
        this.ui.ctx.drawImage(background, 0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    handlePressAnyKey() {
        console.log('test');
        
        this.showPressAnyKey = false;
        this.menuActive = true; // Menü aktivieren
        this.layer = 0; // Startmenü anzeigen
        window.removeEventListener('keydown', this.pressAnyKeyListener);
        //this.onStart = false;
    }

    drawPressAnyKey(deltaTime) {
        this.blinkTimer += deltaTime;
        const blink = Math.floor(this.blinkTimer * 2) % 2 === 0; // Einfache Blinklogik

        this.clearCanvas();
        this.drawBackground(this.background);

        if (blink) {
            this.setFont();
            this.ui.ctx.fillText("Press Any Key", this.ui.canvas.width / 2, this.ui.canvas.height / 2 + 220);
        }
    }

    clearCanvas() {
        this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }
}