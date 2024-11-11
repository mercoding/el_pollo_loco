import { Animatable, MovableObject } from "./movableObject.class.js";

export class Character extends Animatable(MovableObject) {
    global;
    constructor(x, y, width, height, animationPaths) {        
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.onGround = true;
        this.jumpStrength = -200; // Sprungkraft
        this.gravity = 800;       // Gravitation (Anpassbar)
        this.health = 3; // Start-Leben des Charakters
        this.isInvincible = false; // Unverwundbarkeit nach Schaden
        this.invincibilityDuration = 1.0; // 1 Sekunde Unverwundbarkeit
        this.collider.width -= 50;
        this.isHurt = false;
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        this.isOnGround(deltaTime);
        if(this.health < 1) this.setState('dead');
        else if(this.isHurt) this.setState('hurt');
        else this.move(deltaTime);
        this.drawCharacter(ctx, screenX);
        this.updateAnimation(deltaTime);
    }

    drawFacingRight(frame, ctx, screenX) {
        ctx.translate(screenX, this.y);
        ctx.scale(1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    drawFacingLeft(frame, ctx, screenX) {
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

    walk(facing, x, speed) {
        this.facingRight = facing;
        this.velocity.x = x * speed;
        if (this.onGround) {
            this.setState('walk');
        }
    }

    idle() {
        if (this.onGround) {
            this.velocity.x = 0;
            this.setState('idle');
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
        if (!this.isInvincible) { // Nur Schaden, wenn nicht unverwundbar
            this.health -= 1; // Reduziert das Leben um 1
            this.isInvincible = true;
            this.isHurt = true;
            this.setState('hurt');
            this.velocity.x = this.facingRight ? -150 : 150;            
            setTimeout(() => {
                this.isInvincible = false;
                this.isHurt = false;
                if(this.health > 0) this.setState(this.onGround ? 'idle' : 'jump');
            }, this.invincibilityDuration * 1000);
        }
        this.isDead();
    }

    isDead() {
        if (this.health <= 0) {
            this.setState('dead');
            //setTimeout(() => { this.global.gameOver = true;}, 8000);
        }
    }

    setStateOnce(newState) {
        if(this.state !== newState) this.setState(newState);
    }
}
