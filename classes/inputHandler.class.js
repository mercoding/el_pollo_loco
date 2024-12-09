export class InputHandler {
    constructor() {
        this.anyKey = false;
        this.keysPressed = { left: false, right: false, up: false, down: false, enter: false, fKey: false, esc: false, any: false, space: false };
        this.keyDownListener = this.handleKeyDown.bind(this);
        this.keyUpListener = this.handleKeyUp.bind(this);
        this.active = false;
        this.menuActive = false; // Flag für Menüzustand

        // Standardmäßig aktiviert
        this.activate();
    }

    menuKeys(e) {
        switch (e.key) {
            case 'ArrowUp':     this.keysPressed.up = true;     break;
            case 'ArrowDown':   this.keysPressed.down = true;   break;
            case 'Enter':       this.keysPressed.enter = true;  break;
            case 'Escape':      this.keysPressed.esc = true;    break;
        }
    }

    gameKeys(e) {
        switch (e.key) {
            case 'ArrowRight':  this.keysPressed.right = true;      break;
            case 'ArrowLeft':   this.keysPressed.left = true;       break;
            case 'ArrowUp':     this.keysPressed.up = true;         break;
            case 'ArrowDown':   this.keysPressed.down = true;       break;
            case 'Enter':       this.keysPressed.enter = true;      break;
            case 'Escape':      this.keysPressed.esc = true;        break;
            case ' ':           this.keysPressed.space = true;      break;
            case 'f':           this.keysPressed.fKey = true;       break;
        }
    }

    handleKeyDown(e) {
        this.keysPressed.any = true;
        if (this.menuActive) this.menuKeys(e)
        else this.gameKeys(e);
    }

    handleKeyUp(e) {
        this.keysPressed.any = false;
        switch (e.key) {
            case 'ArrowRight':  this.keysPressed.right = false;     break;
            case 'ArrowLeft':   this.keysPressed.left = false;      break;
            case 'ArrowUp':     this.keysPressed.up = false;        break;
            case 'ArrowDown':   this.keysPressed.down = false;      break;
            case 'Enter':       this.keysPressed.enter = false;     break;
            case 'Escape':      this.keysPressed.esc = false;       break;
            case ' ':           this.keysPressed.space = false;     break;
            case 'f':           this.keysPressed.fKey = false;      break;
        }
    }

    activate() {
        if (!this.active) {
            window.addEventListener('keydown', this.keyDownListener);
            window.addEventListener('keyup', this.keyUpListener);
            this.active = true;
        }
    }
    
    deactivate() {
        if (this.active) {
            window.removeEventListener('keydown', this.keyDownListener);
            window.removeEventListener('keyup', this.keyUpListener);
            this.active = false;
        }
    }
    

    setMenuActive(active) {
        this.menuActive = active;
        this.keysPressed = { left: false, right: false, up: false, down: false, enter: false, fKey: false, esc: false, space: false }; // Reset keys
    }

    getInput() {
        return this.keysPressed;
    }    

}
