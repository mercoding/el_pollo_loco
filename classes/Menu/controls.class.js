import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { StartMenu } from "./startMenu.class.js";

export class Controls {
    constructor(ui) {
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.upImg = new Image();
        this.leftImg = new Image();
        this.rightImg = new Image();
        this.selectedOption = 0;
        this.onStart();
    }

    onStart() {
        this.controlsMenu = [
            { label: 'Jump', image: 'triangle-up' },
            { label: 'Move Left', image: 'triangle-left' },
            { label: 'Move Right', image: 'triangle-right' },
            { label: 'Shoot' },
        ];
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.upImg.src = "img/ui/up.png";
        this.startMenuBackground.src = "img/wood.jpg";
        this.ui.menuActive = true;
        this.selectedOption = 6;

        this.addMenuListeners();
    }

    onUpdate(deltaTime) {
        this.drawControlsMenu();
    }

    onExit() {
        this.removeMenuListeners();
    }

    setFont() {
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.font = '20px Boogaloo';
        this.ui.ctx.textAlign = 'center';
    }

    drawTriangle(x, y, direction) {
        this.ui.ctx.beginPath();
        if (direction === 'up') {
            // Dreieck nach oben
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x - 15, y + 30); // Linke Ecke
            this.ui.ctx.lineTo(x + 15, y + 30); // Rechte Ecke
        } else if (direction === 'left') {
            // Dreieck nach links
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x + 30, y - 15); // Obere Ecke
            this.ui.ctx.lineTo(x + 30, y + 15); // Untere Ecke
        } else if (direction === 'right') {
            // Dreieck nach rechts
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x - 30, y - 15); // Obere Ecke
            this.ui.ctx.lineTo(x - 30, y + 15); // Untere Ecke
        }
        this.ui.ctx.closePath();
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.fill();
    }
    

    drawControlsMenu() {
        this.drawBackground(this.background);
        this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 200, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        

        this.ui.ctx.font = '30px Boogaloo';
        this.ui.ctx.fillText("Controls", this.ui.canvas.width / 2, 90);

        this.controlsMenu.forEach((control, index) => {
            const y = 150 + index * 60;
    
            // Zeichne das Label
            this.ui.ctx.fillStyle = 'white';
            this.ui.ctx.textAlign = 'left';
            this.ui.ctx.fillText(control.label, this.ui.canvas.width / 2 - 100, y);
    
            // Zeichne ein gezeichnetes Dreieck für die Steuerung
            if (control.image === 'triangle-up') {
                this.drawTriangle(this.ui.canvas.width / 2 + 85, y - 25, 'up');
            } else if (control.image === 'triangle-left') {
                this.drawTriangle(this.ui.canvas.width / 2 + 70, y - 10, 'left');
            } else if (control.image === 'triangle-right') {
                this.drawTriangle(this.ui.canvas.width / 2 + 100, y - 10, 'right');
            } else if (control.label === 'Shoot') {
                // Text für "Shoot"
                this.ui.ctx.font = '25px Boogaloo';
                this.ui.ctx.fillText("F", this.ui.canvas.width / 2 + 70, y + 10);
            }
        });
        // Zeichne die Steuerungsoptionen
        /*
        this.controlsMenu.forEach((control, index) => {
            const y = 150 + index * 60;
    
            // Zeichne das Label
            this.ui.ctx.fillStyle = 'white';
            this.ui.ctx.textAlign = 'left';
            this.ui.ctx.fillText(control.label, this.ui.canvas.width / 2 - 90, y);
    
            if (control.image) {
                // Bild laden und zeichnen
                const img = new Image();
                img.src = control.image;
                img.onload = () => {
                    this.ui.ctx.drawImage(img, this.ui.canvas.width / 2 + 50, y - 25, 50, 50);
                };
            } else if (control.label === 'Shoot') {
                // Text für "Shoot"
                this.ui.ctx.font = '25px Boogaloo';
                this.ui.ctx.fillText("F", this.ui.canvas.width / 2 + 50, y + 10);
            }
            /*
            if (control.label === 'Shoot') {
                // F-Taste als Text darstellen
                this.ui.ctx.font = '25px Boogaloo';
                this.ui.ctx.fillText("F", this.ui.canvas.width / 2 + 90, y);
            } else {
                // Zeichne das Bild
                const img = new Image();
                img.src = control.image;
                img.onload = () => {
                    this.ui.ctx.drawImage(img, this.ui.canvas.width / 2 + 90, y, 200, 200);
                };
            }*/
        //});

        // Zeichne den Back-Button
        this.ui.ctx.fillStyle = 'yellow';
        this.ui.ctx.textAlign = 'center';
        this.ui.ctx.font = '30px Boogaloo';
        this.ui.ctx.fillText("Back", this.ui.canvas.width / 2, this.ui.canvas.height - 70);
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


    

    executeMenuOption() {
        this.ui.menuActive = true;
        this.ui.global.pause = true;
        if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
        else this.ui.menu.changeMenu(new GameMenu(this.ui));

    }

    

    handleEscapeKeyInput(event) {
        if (event.key === 'Escape') {
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    handleSettingsInput(event) {
        const currentOption = this.controlsMenu[6];
        this.ui.menu.changeMenu(new StartMenu(this.ui));
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
        this.controlsMenu.forEach((option, index) => {
            const y = 170 + index * 80;
            this.handleButton(option, mouseX, mouseY);
        });
    }

    applySettings(label, value) {
        if (label === "Back") {
            this.ui.menu.changeMenu(new StartMenu(this.ui));
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