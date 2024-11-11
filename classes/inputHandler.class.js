export class InputHandler {
    constructor() {
        this.keysPressed = { left: false, right: false, up: false, };

        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowRight') this.keysPressed.right = true;
            if(e.key === 'ArrowLeft') this.keysPressed.left = true;
            if(e.key === 'ArrowUp') this.keysPressed.up = true;
        });

        window.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowRight') this.keysPressed.right = false;
            if(e.key === 'ArrowLeft') this.keysPressed.left = false;
            if(e.key === 'ArrowUp') this.keysPressed.up = false;
        });
    }

    getInput() { return this.keysPressed };
}