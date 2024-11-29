import { InputHandler } from "../inputHandler.class.js";
import { ClosedMenu } from "./closedMenu.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { Intro } from "./intro.class.js";
import { Settings } from "./settings.class.js";

export class StartMenu {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.selectedOption = 0;
        this.onStart();
    }

    onStart() {
        this.menuOptions = ['New Game', 'Settings', 'Quit']; // Menüoptionen
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.startMenuBackground.src = "img/wood.jpg";
        this.ui.global.audioManager.musicVolume = this.ui.global.getMusicVolumes();
        this.ui.global.audioManager.effectsVolume = this.ui.global.getSoundVolumes();
        this.ui.intro = false;
        this.ui.menuActive = true;
        this.addMenuListeners();
    }

    onUpdate(deltaTime) {

        this.drawStartMenu();
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

    drawStartMenuOptions() {
        // Menüoptionen zeichnen
        this.menuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 - 70 + index * 80;
            this.ui.ctx.fillStyle = this.selectedOption === index ? 'yellow' : 'white'; // Highlight
            if (option === "Quit") this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y + 80);
            else this.ui.ctx.fillText(option, this.ui.canvas.width / 2, y);
        });
    }

    NewGame(selected) {
        if (selected === 'New Game') {
            this.ui.global.inGame = true;
            this.ui.menuActive = false;
            this.ui.intro = false;
            this.ui.global.pause = false;
            window.removeEventListener('keydown', this.pressAnyKeyListener);
            this.ui.menu.changeMenu(new ClosedMenu(this.ui));
            this.ui.game.StartGame();
        }
    }

    Settings(selected) {
        if (selected === 'Settings') {
            this.ui.global.inGame = false;
            this.ui.menuActive = true;
            this.ui.intro = false;
            this.selectedOption = 0;
            this.ui.menu.changeMenu(new Settings(this.ui));
        }
    }

    Quit(selected) {
        if (selected === 'Quit') {
            this.ui.global.inGame = false;
            this.ui.menuActive = false;
            this.ui.intro = true;
            this.selectedOption = 0;
            this.ui.menu.changeMenu(new Intro(this.ui));
        }
    }

    startMenu() {
        const selected = this.menuOptions[this.selectedOption];
        this.NewGame(selected);
        this.Settings(selected);
        this.Quit(selected);
    }

    drawStartMenu() {
        this.drawBackground(this.background);
        this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 200, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        const title = "Main Menu";
        this.ui.ctx.fillText(title, this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 150);
        this.drawStartMenuOptions();
    }

    menuKeyInputInStartMenu(event) {
        const input = this.inputHandler.getInput();
        if (input.up) this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        else if (input.down) this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        else if (input.enter) this.startMenu();
    }


    clearCanvas() {
        this.ui.ctx.clearRect(0, 0, this.ui.canvas.width, this.ui.canvas.height);
    }

    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.menuKeyInputInStartMenu(event);
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

    handleMenuMouseOptions(mouseX, mouseY) {
        this.menuOptions.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 - 70 + index * 80;
            if (mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
                mouseY > y - 20 && mouseY < y + 20) {
                this.selectedOption = index;
                this.startMenu();
            }
        });
    }

    handleMenuMouseQuitButton(mouseX, mouseY) {
         const backY = this.ui.canvas.height - 70;
         if (mouseX > this.ui.canvas.width / 2 - 150 && mouseX < this.ui.canvas.width / 2 + 150 &&
             mouseY > backY - 20 && mouseY < backY + 20) {
             this.layer = this.lastLayer;
             this.ui.intro = true;
             this.ui.menuActive = false;
             this.selectedOption = 0;
             this.ui.menu.changeMenu(new Intro(this.ui));
         }
    }

    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        this.handleMenuMouseOptions(mouseX, mouseY);
        this.handleMenuMouseQuitButton(mouseX, mouseY);
    }
}
