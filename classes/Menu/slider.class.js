import { MenuGUI } from "./menuGUI.class.js";

/**
 * Create and draw slider for music and sound volume
 *
 * @export
 * @class Slider
 * @typedef {Slider}
 * @extends {MenuGUI}
 */
export class Slider extends MenuGUI {
    constructor(ui, x, y, width, height, value, image, onChangeCallback, selectedOption, tag = "") {
        super(ui);
        this.ctx = ui.ctx;
        this.x = x; 
        this.y = y; 
        this.tag = tag;
        this.width = width; 
        this.height = height; 
        this.value = value; 
        this.image = new Image(); 
        this.image.src = image; 
        this.dragging = false; 
        this.onChange = onChangeCallback; 
        this.selected = false;
        this.selectedOption = selectedOption;
        this.ui.canvas.removeEventListener('mousemove', this.mouseHoverListener); 
        this.mouseHoverListener = (event) => this.handleMouseHover(event);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); 
    }

    /** Set image color to yellow */
    setImageColor() {
        if(this.selected) {
            if(this.tag === "music") this.image.src = 'img/ui/MusicYellow.png';
            else this.image.src = 'img/ui/SoundYellow.png';
        }
        else {
            if(this.tag === "music") this.image.src = 'img/ui/Music.png';
            else this.image.src = 'img/ui/Sound.png';
        }
    }

    /** Set image to mute */
    setImageMute() {
        if(this.value === 0 && !this.selected) {
            if(this.tag === "music") this.image.src = 'img/ui/NoneMusic.png';
            else this.image.src = 'img/ui/NoneSound.png';
        }
        else if(this.value === 0 && this.selected) {
            if(this.tag === "music") this.image.src = 'img/ui/NoneMusicYellow.png';
            else this.image.src = 'img/ui/NoneSoundYellow.png';
        }
    }

    /** Set Image color and shows if mute */
    setImage() {
        this.setImageColor();
        this.setImageMute();
    }
    

    /** Draw slider */
    draw() {
        if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, this.y - 20, 200, 50, 20);
        this.setImage();
        this.ctx.drawImage(this.image, this.x - 50, this.y - 15, 40, 40);
        this.ctx.fillStyle = 'grey';
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
        const handleX = this.x + this.value * this.width;
        this.ctx.fillStyle = (this.selected) ? 'yellow' : 'white';
        this.ctx.beginPath();
        this.ctx.arc(handleX, this.y + this.height / 2, this.height / 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Handle mouse down on slider
     *
     * @param {*} mouseX
     * @param {*} mouseY
     */
    handleMouseDown(mouseX, mouseY) {
        const handleX = this.x + this.value * this.width;
        const distance = Math.sqrt((mouseX - handleX) ** 2 + (mouseY - (this.y + this.height / 2)) ** 2);
        if (distance <= this.height) {
            this.dragging = true;
        }
    }

    /**
     * Handle mouse move on slider
     *
     * @param {*} mouseX
     */
    handleMouseMove(mouseX) {
        if (!this.dragging) return;

        const clampedX = Math.max(this.x, Math.min(mouseX, this.x + this.width));
        this.value = (clampedX - this.x) / this.width;

        if (this.onChange) this.onChange(this.value);
    }

    /** Handle mouse up and set dragging to false */
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
        if (mouseX > this.x && mouseX < this.x + this.width &&
            mouseY > this.y && mouseY < this.y + this.height) {
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


    /** Handle key input on music slider */
    handleArrowKeyInputOnMusicSlider(event, currentOption) {
        if (event.key === 'ArrowLeft' && currentOption === 1) {
            const value = Math.max(0, this.ui.global.getMusicVolumes() - 0.1);
            this.onChange(value)
        }
        else if (event.key === 'ArrowRight' && currentOption === 1) {
            const value = Math.max(0, this.ui.global.getMusicVolumes() + 0.1);
            this.onChange(value)
        }
    }

    /** Handle key input on sound slider */
    handleArrowKeyInputOnSoundSlider(event, currentOption) {
        if (event.key === 'ArrowLeft' && currentOption === 2) {
            const value = Math.max(0, this.ui.global.getSoundVolumes() - 0.1);
            this.onChange(value);
        }
        else if (event.key === 'ArrowRight' && currentOption === 2) {
            const value = Math.max(0, this.ui.global.getSoundVolumes() + 0.1);
            this.onChange(value);
        }
    }

    /**
     * Handle arrow key on slider music volume / sound volume
     *
     * @param {*} event
     * @param {*} currentOption
     */
    handleArrowKeyInput(event, currentOption) {
        this.handleArrowKeyInputOnMusicSlider(event, currentOption);
        this.handleArrowKeyInputOnSoundSlider(event, currentOption);
        this.draw();
    }
}
