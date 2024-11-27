import { InputHandler } from "./inputHandler.class.js";

export class StartMenu {
    constructor(game) {
        this.game = game;
        this.global = game.global;
        this.audioManager = game.global.audioManager;
        this.canvas = game.canvas;
        this.ctx = game.canvas.getContext('2d');

        this.menuOptions = ["New Game", "Setting"];
        this.selectedIndex = 0;
        this.showSettings = false;
        this.musicVolume = this.audioManager.musicVolume; // Initial Lautstärke
        this.soundVolume = this.audioManager.effectsVolume;

        this.slider = { x: 150, width: 200, height: 20 }; // Slider Eigenschaften
        this.inputHandler = new InputHandler();
        this.selectedOption = 0;
        this.lastFrameTime = performance.now();
    }


    Update() {
        if(this.global.inGame) return;
        const currentFrameTime = performance.now();
        const deltaTime = (currentFrameTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentFrameTime;
        this.handleMenuInput(deltaTime);
        this.drawMenu(); // Menü aktualisieren
        requestAnimationFrame(() => this.Update());
    }


    drawSettings() {
        const ctx = this.ctx;
        ctx.fillText("Einstellungen", this.canvas.width / 2 - 100, 100);

        // Musik Lautstärke
        ctx.fillStyle = "white";
        ctx.fillText("Musik Lautstärke", this.canvas.width / 2 - 100, 150);
        this.drawSlider(ctx, this.musicVolume, 150);

        // Sound Lautstärke
        ctx.fillText("Sound Lautstärke", this.canvas.width / 2 - 100, 200);
        this.drawSlider(ctx, this.soundVolume, 200);

        // Zurück-Option
        ctx.fillText("Zurück", this.canvas.width / 2 - 100, 300);
    }

    drawSlider(ctx, value, y) {
        const x = this.slider.x;
        ctx.fillStyle = "gray";
        ctx.fillRect(x, y - this.slider.height / 2, this.slider.width, this.slider.height);

        const knobX = x + value * this.slider.width;
        ctx.fillStyle = "yellow";
        ctx.fillRect(knobX - 10, y - this.slider.height, 20, this.slider.height * 2);
    }

    drawMenu() {
        const ctx = this.ctx;

        // Zeichnen eines transparenten Hintergrunds
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Zeichnen des Menüs
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';

        // Menüoptionen zeichnen
        this.menuOptions.forEach((option, index) => {
            const y = this.canvas.height / 2 + index * 40;
            ctx.fillStyle = this.selectedOption === index ? 'yellow' : 'white'; // Highlight
            ctx.fillText(option, this.canvas.width / 2, y);
        });
    }

    handleMenuInput(deltaTime) {
        //if (!this.menuActive) return;

        const input = this.global.inputHandler.getInput();

        // Eingabeverzögerung implementieren
        this.inputCooldown = this.inputCooldown || 0; // Initialisieren, falls nicht vorhanden
        this.inputCooldown -= deltaTime;

        if (this.inputCooldown <= 0) {
            if (input.up) {
                this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
                this.inputCooldown = 0.2; // Wartezeit von 200 ms
            } else if (input.down) {
                this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
                this.inputCooldown = 0.2; // Wartezeit von 200 ms
            }

            // Auswählen mit Enter
            if (input.enter) {
                this.executeMenuOption();
                this.inputCooldown = 0.2; // Wartezeit von 200 ms
            }
        }


    }


    executeMenuOption() {
        const selected = this.menuOptions[this.selectedOption];

        if (selected === 'New Game') {
            this.global.inGame = true; // Menü schließen
            this.game.Start();
            //this.selectedOption = 0;
        } else if (selected === 'Settings') {
            console.log('Settings selected'); // Einstellungen öffnen
        }/* else if (selected === 'Exit') {
            console.log('Exit selected'); // Spiel beenden
        }*/
    }

    mouseMenuListener() {
        if (!this.menuActive) return;
        this.canvas.addEventListener('click', (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            // Überprüfen, ob die Maus über einer Menüoption ist
            this.menuOptions.forEach((option, index) => {
                const y = this.canvas.height / 2 + index * 40;
                if (mouseX > this.canvas.width / 2 - 100 && mouseX < this.canvas.width / 2 + 100 &&
                    mouseY > y - 20 && mouseY < y + 20) {
                    this.selectedOption = index;
                    this.executeMenuOption();
                }
            });
        });
    }
}
