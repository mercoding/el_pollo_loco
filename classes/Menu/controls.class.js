import { InputHandler } from "../inputHandler.class.js";
import { GameMenu } from "./gameMenu.class.js";
import { MenuGUI } from "./menuGUI.class.js";
import { StartMenu } from "./startMenu.class.js";

/**
 * Draw control menu
 *
 * @export
 * @class Controls
 * @typedef {Controls}
 * @extends {MenuGUI}
 */
export class Controls extends MenuGUI {
    constructor(ui) {
        super(ui);
        this.ui = ui;
        this.inputHandler = new InputHandler();
        this.background = new Image();
        this.startMenuBackground = new Image();
        this.buttonBackground = new Image();
        this.upImg = new Image();
        this.leftImg = new Image();
        this.rightImg = new Image();
        this.selectedOption = 5;
        this.onStart();
    }

    /** Set controls options */
    setControlsMenu() {
        this.controlsMenu = [
            { label: 'Jump/Double', image: 'triangle-up' },
            { label: 'Move Left', image: 'triangle-left' },
            { label: 'Move Right', image: 'triangle-right' },
            { label: 'Shoot' }, { label: 'Menu/Pause' },
            { label: 'Back', type: 'button' },
        ];
    }

    /** Set control buttons position */
    setButtonPositions() {
        this.buttonPositions = this.controlsMenu.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 100,
            y: this.ui.canvas.height / 2 - 110 + index * 70,
            width: 200,
            height: 50,
        }));
    }

    /** Set settings on start */
    onStart() {
        this.setControlsMenu();
        this.background.src = "img/9_intro_outro_screens/start/startscreen_1.png";
        this.upImg.src = "img/ui/up.png";
        this.startMenuBackground.src = "img/ui/panel.png";
        this.buttonBackground.src = "img/ui/button.png";
        this.ui.menuActive = true;
        this.selectedOption = 6;
        this.setButtonPositions();
        this.addMenuListeners();
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        this.drawControlsMenu();
        this.selectedOption = 5;
    }

    /** Set settings on exit */
    onExit() {
        this.removeMenuListeners();
        this.ui.canvas.style.cursor = 'default';
    }

    /**
     * Draw up triangle for arrow key input
     *
     * @param {*} x
     * @param {*} y
     * @param {*} direction
     */
    drawTriangleUp(x, y, direction) {
        if (direction === 'up') {
            // Dreieck nach oben
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x - 15, y + 25); // Linke Ecke
            this.ui.ctx.lineTo(x + 15, y + 25); // Rechte Ecke
        }
    }

    /**
     * Draw left triangle for arrow key input
     *
     * @param {*} x
     * @param {*} y
     * @param {*} direction
     */
    drawTriangleLeft(x, y, direction) {
        if (direction === 'left') {
            // Dreieck nach links
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x + 25, y - 15); // Obere Ecke
            this.ui.ctx.lineTo(x + 25, y + 15); // Untere Ecke
        }
    }

    /**
     * Draw right triangle for arrow key input
     *
     * @param {*} x
     * @param {*} y
     * @param {*} direction
     */
    drawTriangleRight(x, y, direction) {
        if (direction === 'right') {
            // Dreieck nach rechts
            this.ui.ctx.moveTo(x, y); // Spitze
            this.ui.ctx.lineTo(x - 25, y - 15); // Obere Ecke
            this.ui.ctx.lineTo(x - 25, y + 15); // Untere Ecke
        }
    }

    /**
     * Draw triangle for arrow key inputs
     *
     * @param {*} x
     * @param {*} y
     * @param {*} direction
     */
    drawTriangle(x, y, direction) {
        this.ui.ctx.beginPath();
        this.drawTriangleUp(x, y, direction);
        this.drawTriangleLeft(x, y, direction);
        this.drawTriangleRight(x, y, direction);
        this.ui.ctx.closePath();
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.fill();
    }

    /**
     * Draw back button
     *
     * @param {*} option
     * @param {*} isSelected
     * @param {*} y
     */
    drawButton(option, isSelected, y) {
        if (option.type === 'button') {
            // "Back"-Option zeichnen
            this.selectedOption = 4;
            this.ui.ctx.textAlign = 'center';
            this.ui.ctx.font = '30px Boogaloo';
            const backY = this.ui.canvas.height - 70;
            if (!this.ui.global.inGame) this.drawRoundedButton(this.ui.ctx, this.ui.canvas.width / 2 - 100, y - 5, 200, 50, 20);
            this.ui.ctx.fillStyle = isSelected && !this.hasTouchSupport() ? 'yellow' : 'white';
            this.ui.ctx.fillText("Back", this.ui.canvas.width / 2, y + 30);
        }
    }

    /**
     * Draw triangles
     *
     * @param {*} option
     * @param {*} y
     */
    drawTriangles(option, y) {
        if (option.image === 'triangle-up') {
            this.drawTriangle(this.ui.canvas.width / 2 + 85, y - 25, 'up');
        } else if (option.image === 'triangle-left') {
            this.drawTriangle(this.ui.canvas.width / 2 + 70, y - 10, 'left');
        } else if (option.image === 'triangle-right') {
            this.drawTriangle(this.ui.canvas.width / 2 + 100, y - 10, 'right');
        }
    }

    /**
     * Draw shoot input
     *
     * @param {*} option
     * @param {*} y
     */
    drawShootInput(option, y) {
        if (option.label === 'Shoot') {
            // Text für "Shoot"
            this.ui.ctx.font = '25px Boogaloo';
            this.ui.ctx.fillText("F", this.ui.canvas.width / 2 + 80, y - 2.5);
        }
        if (option.label === 'Menu/Pause') {
            // Text für "Shoot"
            this.ui.ctx.font = '25px Boogaloo';
            this.ui.ctx.fillText("P", this.ui.canvas.width / 2 + 80, y - 2.5);
        }
    }

    /**
     * Draw controls
     *
     * @param {*} option
     * @param {*} index
     * @param {*} y
     */
    drawControls(option, index, y) {
        this.ui.ctx.fillStyle = 'white';
        this.ui.ctx.textAlign = 'left';
        this.ui.ctx.fillText(option.label, this.ui.canvas.width / 2 - 100, y);
        this.drawTriangles(option, y);
        this.drawShootInput(option, y);
    }

    /** Draw controls options */
    drawControlsOptions() {
        this.controlsMenu.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 - 80 + index * 40;

            const isSelected = this.selectedOption === index;
            if (option.label !== 'Back') this.drawControls(option, index, y);
            this.drawButton(option, isSelected, y-10);
        });
    }


    /** Draw controls menu */
    drawControlsMenu() {
        this.drawBackground(this.background);
        this.drawImageWithRoundedBorder(this.ui.ctx, this.startMenuBackground, this.ui.canvas.width / 2 - 150, this.ui.canvas.height / 2 - 203, 300, 400, 20, "transparent", 2, 0.85);
        this.setFont();
        this.ui.ctx.font = '30px Boogaloo';
        this.ui.ctx.fillText("Controls", this.ui.canvas.width / 2, this.ui.canvas.height / 2 - 130);
        this.drawControlsOptions();
    }


    /** Execute menu options */
    executeMenuOption() {
        this.ui.menuActive = true;
        this.ui.global.pause = true;
        if (!this.ui.global.inGame) this.ui.menu.changeMenu(new StartMenu(this.ui));
        else this.ui.menu.changeMenu(new GameMenu(this.ui));

    }



    /**
     * Handle escape key input
     *
     * @param {*} event
     */
    handleEscapeKeyInput(event) {
        if (event.key === 'Escape') {
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    /**
     * Handle settings input
     *
     * @param {*} event
     */
    handleSettingsInput(event) {
        const currentOption = this.controlsMenu[6];
        this.ui.menu.changeMenu(new StartMenu(this.ui));
    }


    /**
     * Handle button by mouse
     *
     * @param {*} option
     * @param {*} mouseX
     * @param {*} mouseY
     * @param {*} y
     */
    handleButton(option, mouseX, mouseY, y) {
        const backY = (window.innerWidth < 1024) ? this.ui.canvas.height - 80 : this.ui.canvas.height - 70;
        if ((option.type === 'button') && mouseX > this.ui.canvas.width / 2 - 95 && mouseX < this.ui.canvas.width / 2 + 110 &&
            mouseY > y - 20 && mouseY < y + 30) {
            this.ui.menuActive = true;
            this.applySettings(option.label, option.value);
            this.selectedOption = 0;
        }
    }

    /**
     * handle menu mouse input
     *
     * @param {*} event
     */
    handleMenuMouseInput(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        // Settings-Menü
        this.controlsMenu.forEach((option, index) => {
            const y = this.ui.canvas.height / 2 - 80 + index * 40;

            this.handleButton(option, mouseX, mouseY, y);
        });
    }

    /**
     * Apply settings by mouse input
     *
     * @param {*} label
     * @param {*} value
     */
    applySettings(label, value) {
        if (label === "Back") {
            this.ui.menu.changeMenu(new StartMenu(this.ui));
        }
    }

    /** Add menu listeners */
    addMenuListeners() {
        this.removeMenuListeners(); // Alte Listener sicher entfernen
        this.keyListener = (event) => this.handleSettingsInput(event);
        this.mouseListener = (event) => this.handleMenuMouseInput(event);
        this.mouseHoverListener = (event) => this.handleMouseHover(event);


        window.addEventListener('keydown', this.keyListener);
        this.ui.canvas.addEventListener('click', this.mouseListener);
        this.ui.canvas.addEventListener('mousemove', this.mouseHoverListener); // Hinzugefügt
    }

    /** Remove menu listeners  */
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


    /**
     * Handle mouse hover -> cursor pointer
     *
     * @param {*} event
     */
    handleMouseHover(event) {
        const rect = this.ui.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.ui.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.ui.canvas.height / rect.height);

        let isHovering = false;

        this.buttonPositions.forEach((button, index) => {
            if (
                mouseX > button.x &&
                mouseX < button.x + button.width &&
                mouseY > button.y &&
                mouseY < button.y + button.height
            ) {
                if(index === 3) {
                    isHovering = true;
                }
            }
            
        });
        this.ui.canvas.style.cursor = isHovering ? 'pointer' : 'default';
    }

    /** Update UI positions */
    updateUIPositions() {
        this.buttonPositions = this.controlsMenu.map((_, index) => ({
            x: this.ui.canvas.width / 2 - 100,
            y: this.ui.canvas.height / 2 - 110 + index * 70,
            width: 200,
            height: 50,
        }));
    }

    /**
    * Check if device has touch support
    *
    * @returns {boolean}
    */    
    hasTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
}