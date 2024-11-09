import { Animatable, MovableObject } from "./movableObject.class.js";

export class Character extends Animatable(MovableObject) {
    constructor(x, y, width, height, animationPaths) {        
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.onGround = true;
        this.jumpStrength = -200; // Sprungkraft
        this.gravity = 800;       // Gravitation (Anpassbar)
        this.keyPressed = false;
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        // Falls der Charakter in der Luft ist, wirkt Gravitation
        if (!this.onGround) {
            this.velocity.y += this.gravity * deltaTime; // Gravitationskraft addieren
        }

        this.move(deltaTime); // Bewegung berechnen (inkl. vertikaler Geschwindigkeit)

        // Bodenüberprüfung und Landen
        if (this.y + this.height >= 430) { // Bodenhöhe hier auf `400` festgelegt
            this.y = 430 - this.height; // Charakter auf dem Boden halten
            this.land(); // Charakter landet und Animation wird zurückgesetzt
        }

        this.updateAnimation(deltaTime); // Animation aktualisieren
        const frame = this.getCurrentFrame();
        if (frame) {
            ctx.save();
            if (!this.facingRight) {
                ctx.translate(screenX / 4 - this.width, this.y);
                ctx.scale(-1, 1);
                ctx.drawImage(frame, -screenX, 0, this.width, this.height);
            } else {
                ctx.translate(screenX, this.y);
                ctx.drawImage(frame, 0, 0, this.width, this.height);
            }
            ctx.restore();
        }
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpStrength;
            this.onGround = false; 
            this.setState('jump'); 
        }
    }

    land() {
        this.onGround = true;
        this.velocity.y = 0;
        if (this.state == 'jump') this.setState('idle');
        else if (this.keyPressed) this.setState('walk');
    }
}
