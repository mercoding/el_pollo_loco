import { MenuGUI } from "./menuGUI.class.js";

export class Slider extends MenuGUI {
    constructor(ui, x, y, width, height, value, image, onChangeCallback, selectedOption) {
        super(ui);
        this.ctx = ui.ctx;
        this.x = x; // Position X
        this.y = y; // Position Y
        this.width = width; // Breite des Sliders
        this.height = height; // Höhe des Sliders
        this.value = value; // Aktueller Wert (0 bis 1)
        this.image = new Image(); // Bild-Icon für den Slider
        this.image.src = image; // Pfad des Bildes
        this.dragging = false; // Ob der Slider gerade bewegt wird
        this.onChange = onChangeCallback; // Callback bei Wertänderung
        this.selected = false;
        this.selectedOption = selectedOption;
        this.ui.canvas.removeEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
        this.mouseHoverListener = (event) => this.handleMouseHover(event);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
    }

    draw() {
        if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, this.y - 20, 200, 50, 20);
        this.ctx.drawImage(this.image, this.x - 50, this.y - 15, 40, 40);
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        const handleX = this.x + this.value * this.width;
        this.ctx.fillStyle = (this.selected) ? 'yellow' : 'white';
        this.ctx.beginPath();
        this.ctx.arc(handleX, this.y + this.height / 2, this.height / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    handleMouseDown(mouseX, mouseY) {
        const handleX = this.x + this.value * this.width;
        const distance = Math.sqrt((mouseX - handleX) ** 2 + (mouseY - (this.y + this.height / 2)) ** 2);
        if (distance <= this.height) {
            this.dragging = true;
        }
    }

    handleMouseMove(mouseX) {
        if (!this.dragging) return;

        const clampedX = Math.max(this.x, Math.min(mouseX, this.x + this.width));
        this.value = (clampedX - this.x) / this.width;

        // Callback bei Veränderung
        if (this.onChange) this.onChange(this.value);
    }

    handleMouseUp() {
        this.dragging = false;
    }

    /**
    * Handle mouse hover effect -> cursor pointer
    *
    * @param {*} event
    */
    handleMouseHover(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);
        if (
            mouseX > this.x &&
            mouseX < this.x + this.width &&
            mouseY > this.y &&
            mouseY < this.y + this.height
        ) {
            this.selected = true;
        }
        else this.selected = false;
    }


    /**
     * Handle settings key input
     *
     * @param {*} event
     */
    handleSettingsInput(event) {
        const currentOption = this.selectedOption;
        this.ui.global.getVolumes();
        this.handleArrowKeyInput(event, currentOption);
    }

    /**
     * Handle arrow key on slider music volume / sound volume
     *
     * @param {*} event
     * @param {*} currentOption
     */
    handleArrowKeyInput(event, currentOption) {
        if (event.key === 'ArrowLeft' && currentOption === 1) {
            const value = Math.max(0, this.ui.global.getMusicVolumes() - 0.1);
            //this.ui.global.setMusicVolumes(value);
            this.onChange(value)
        }
        else if (event.key === 'ArrowRight' && currentOption === 1) {
            const value = Math.max(0, this.ui.global.getMusicVolumes() + 0.1);
            //this.ui.global.setMusicVolumes(value);
            this.onChange(value)

        }
        else if (event.key === 'ArrowLeft' && currentOption === 2) {
            const value = Math.max(0, this.ui.global.getSoundVolumes() - 0.1);
            //this.ui.global.setSoundVolumes(value);
            this.onChange(value)
        }
        else if (event.key === 'ArrowRight' && currentOption === 2) {
            const value = Math.max(0, this.ui.global.getSoundVolumes() + 0.1);
            //this.ui.global.setSoundVolumes(value);
            this.onChange(value)
        }
        this.draw();
    }
}
