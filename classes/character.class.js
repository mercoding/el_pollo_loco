import { Animatable, MovableObject } from "./movableObject.class.js";

export class Character extends Animatable(MovableObject) {
    global;
    constructor(x, y, width, height, animationPaths) {        
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.onGround = true;
        this.jumpStrength = -200; // Sprungkraft
        this.gravity = 800;       // Gravitation (Anpassbar)
        this.keyPressed = false;
        this.health = 3; // Start-Leben des Charakters
        this.isInvincible = false; // Unverwundbarkeit nach Schaden
        this.invincibilityDuration = 1.0; // 1 Sekunde Unverwundbarkeit
        this.collider.width -= 50;
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        this.isOnGround(deltaTime);
        this.updateAnimation(deltaTime); // Animation aktualisieren
        this.drawCharacter(ctx, screenX);
        if(this.health < 1) this.setState('dead');
        else if(!this.global.isHurt) this.move(deltaTime); // Bewegung berechnen (inkl. vertikaler Geschwindigkeit)
    }

    isHurt(frame, ctx, screenX) {
        if (!this.facingRight && this.health > 0) {
            //ctx.translate(screenX / 4 - this.width, this.y);
            //ctx.translate(screenX / 4 - this.width, this.y);
            //ctx.scale(-1, 1);
            ctx.drawImage(frame, -screenX, this.y, this.width, this.height);
        }
        
    }

    drawFacingRight(frame, ctx, screenX) {
        if(this.global.isHurt) this.isHurt(frame, ctx, screenX);
        ctx.translate(screenX, this.y);
        ctx.scale(1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    drawFacingLeft(frame, ctx, screenX) {
        if(this.global.isHurt) this.isHurt(frame, ctx, screenX);
        ctx.translate(screenX / 4 - this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -screenX, 0, this.width, this.height);
    }

    drawCharacter(ctx, screenX) {
        const frame = this.getCurrentFrame();
        
        if (frame) {
            ctx.save();
            if (!this.facingRight && this.health > 0) {
                this.drawFacingLeft(frame, ctx, screenX);
            } else {
                this.drawFacingRight(frame, ctx, screenX);
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

    isOnGround(deltaTime) {
        if (!this.onGround) {
            this.velocity.y += this.gravity * deltaTime; // Gravitationskraft addieren
        }
        // Bodenüberprüfung und Landen
        if (this.y + this.height >= 430) { // Bodenhöhe hier auf `400` festgelegt
            this.y = 430 - this.height; // Charakter auf dem Boden halten
            this.land(); // Charakter landet und Animation wird zurückgesetzt
        }
    }

    land() {
        this.onGround = true;
        this.velocity.y = 0;
        if (this.state == 'jump') this.setState('idle');
        else if (this.keyPressed) this.setState('walk');
    }

    takeDamage() {
        this.setState('hurt');
        //this.global.isHurt = true;
        if (!this.isInvincible) { // Nur Schaden, wenn nicht unverwundbar
            this.health -= 1; // Reduziert das Leben um 1
            this.isInvincible = true;
            this.velocity.x = this.facingRight ? -150 : 150;

            setTimeout(() => {
                this.isInvincible = false;
                this.setState('idle');
                //this.global.isHurt = false;
            }, this.invincibilityDuration * 3000);
        }
        this.isDead();
    }

    isDead() {
        if (this.health <= 0) {
            this.setState('dead');
            setTimeout(() => { this.global.gameOver = true;}, 8000);
        }
    }
}
