import { bottleAnimations } from "../animations/bottle.anim.js";
import { Bottle } from "./bottle.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

/**
 * Class to define playable character
 *
 * @export
 * @class Character
 * @typedef {Character}
 * @extends {Animatable(MovableObject)}
 */
export class Character extends Animatable(MovableObject) {
    global;
    constructor(animationPaths, collisionManager, ...args) {
        super(animationPaths, collisionManager, ...args);
        this.facingRight = true;
        this.onGround = false;
        this.jumpStrength = -250; // Sprungkraft
        this.gravity = 800;       // Gravitation (Anpassbar)
        this.isInvincible = false; // Unverwundbarkeit nach Schaden
        this.invincibilityDuration = 1.0; // 1 Sekunde Unverwundbarkeit
        this.isHurt = false;
        this.onTop = false;
        this.lastFootstepTime = 0;
        this.footstepInterval = 0.3;
        this.isLeftFoot = true;
        this.isThrown = false;
        this.throwDuration = 1.0;
        this.doubleJump = false;
    }


    /** Define stats on start */
    Start() {
        this.global.audioManager.loadSound('El Pollo Loco', 'audio/El Pollo Loco.mp3', true);
        this.global.audioManager.loadSound('Left Step', 'audio/Ground_Step3.wav');
        this.global.audioManager.loadSound('Right Step', 'audio/Ground_Step4.wav');
        this.global.audioManager.loadSound('Jump', 'audio/Jump.wav');
        this.global.audioManager.loadSound('Land', 'audio/Land.wav');
        this.global.audioManager.loadSound('Hurt', 'audio/Voice_Male_V2_Pain_Mono_01.wav');
    }

    /**
     * Handle if game is in pause
     *
     * @returns {boolean}
     */
    ifPauseState() {
        if (this.global.pause) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.setState('idle');
            return true;
        }
        return false;
    }

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        this.drawCharacter(ctx, screenX);
        this.updateAnimation(deltaTime);
        if (this.ifPauseState()) return;
        this.isOnGround(deltaTime);
        if (this.global.health < 1) this.setStateOnce('dead');
        else if (this.isHurt) this.setStateOnce('hurt');
        else this.move(deltaTime);
        this.lastFootstepTime += deltaTime;
        this.updateJumpState(deltaTime);
        this.updateCollider();
    }


    /**
     * Draw collider in debug mode
     *
     * @param {*} ctx
     * @param {*} cameraX
     */
    drawCollider(ctx, cameraX) {
        ctx.save();
        ctx.strokeStyle = 'red'; // Collider-Farbe
        ctx.lineWidth = 1; // Dünne Linie
        ctx.strokeRect(
            this.collider.x - cameraX,
            this.collider.y,
            this.collider.width,
            this.collider.height
        );
        ctx.restore();
    }


    /** Update collider */
    updateCollider() {
        super.updateCollider(); // Ruft die GameObject-Logik auf
        this.collider.x = this.x - this.width / 2; // Zentriert den Collider
        this.collider.y = this.y - this.height / 2;
    }


    /**
     * Draw player image facing to right
     *
     * @param {*} frame
     * @param {*} ctx
     * @param {*} screenX
     */
    drawFacingRight(frame, ctx, screenX) {
        ctx.translate(this.x - screenX - this.width / 2, this.y - this.height / 2);
        ctx.scale(1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    /**
     * Draw player image facing to left
     *
     * @param {*} frame
     * @param {*} ctx
     * @param {*} screenX
     */
    drawFacingLeft(frame, ctx, screenX) {
        ctx.translate(this.x - screenX * 2 + this.width / 2, this.y - this.height / 2);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -screenX, 0, this.width, this.height);
    }

    /**
     * Draw character
     *
     * @param {*} ctx
     * @param {*} screenX
     */
    drawCharacter(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            if (!this.facingRight && this.global.health > 0) {
                this.drawFacingLeft(frame, ctx, screenX);
            } else {
                this.drawFacingRight(frame, ctx, screenX);
            }
            ctx.restore();
        }
    }

    /**
     * Walk function handle walking speed and direction
     *
     * @param {*} facing
     * @param {*} x
     * @param {*} speed
     */
    walk(facing, x, speed) {
        this.facingRight = facing;
        this.velocity.x = x * speed;
        if (this.onGround) {
            this.setStateOnce('walk');
            if (this.lastFootstepTime >= this.footstepInterval) {
                this.playFootstepSound();
                this.lastFootstepTime = 0;
            }
        }
    }

    /** Play footsteps */
    playFootstepSound() {
        if (this.isLeftFoot) this.global.audioManager.playSound('Left Step');
        else this.global.audioManager.playSound('Right Step');
        this.isLeftFoot = !this.isLeftFoot;
    }

    /** Stop walking  */
    idle() {
        if (this.onGround) {
            this.velocity.x = 0;
            this.setStateOnce('idle');
        }
    }

    /** Handle Jump and double jump*/
    jump() {
        if (this.onGround) { // first jump
            this.velocity.y = this.jumpStrength;
            this.onGround = false;
            this.canDoubleJump = false; // activate double jump
            this.reachedApex = false;  
            this.global.audioManager.playSound('Jump');
            this.setStateOnce('jump');
        } else if (this.reachedApex && !this.canDoubleJump) { // double jump
            this.velocity.y = this.jumpStrength + 100;
            this.canDoubleJump = true; 
            this.global.audioManager.playSound('Jump');
            this.setStateOnce('jump'); 
        }
    }

    /**
     * Update jump state
     *
     * @param {*} deltaTime
     */
    updateJumpState(deltaTime) {
        if (!this.onGround && !this.reachedApex && this.velocity.y >= 0) {
            this.reachedApex = true; // Scheitelpunkt wurde erreicht
        }
    }



    /**
     * Check if is on ground
     *
     * @param {*} deltaTime
     */
    isOnGround(deltaTime) {
        if (!this.onGround || this.collidingWith === null) {
            this.velocity.y += this.gravity * deltaTime; // Gravitation anwenden
        }
    }

    /** Land game object */
    land() {
        if (!this.onGround) { // Überprüfen, ob der Charakter zuvor nicht auf dem Boden war
            this.global.audioManager.playSound('Land');
        }
        this.doubleJump = false;
        this.jumping = false;
        this.onGround = true; // Charakter ist jetzt auf dem Boden
        this.velocity.y = 0; // Vertikale Geschwindigkeit auf Null setzen
        if (this.state == 'jump') this.setStateOnce('idle'); // Status aktualisieren, wenn vorher im Sprung
    }

    /**
     * Get bottle object for spawning
     *
     * @param {*} velocityX
     * @param {*} velocityY
     * @returns {*}
     */
    getBottle(velocityX, velocityY) {
        const bottle = new Bottle(bottleAnimations, this.collisionManager, this.global,
            this.x + (this.facingRight ? this.width : -this.width),
            this.y, 20, 40, velocityX, velocityY
        );
        return bottle;
    }


    /** Throw bottle */
    throwBottle() {
        if (!this.isThrown) {
            if (this.global.bottles > 0) { // Prüfe, ob der Charakter Flaschen hat
                this.isThrown = true;
                const velocityX = this.facingRight ? 300 : -300; // Richtung der Flasche
                const velocityY = -200; // Anfangsaufwärtsbewegung
                const bottle = this.getBottle(velocityX, velocityY);
                this.global.addGameObject(bottle);
                this.global.bottles -= 1; // Verringere die Anzahl der verfügbaren Flaschen
                this.global.audioManager.playSound('Throw'); // Soundeffekt fürs Werfen
                setTimeout(() => { this.isThrown = false; }, this.throwDuration * 200);
            }
        }
    }

    /** Remove invincible if was hurt */
    removeInvincible() {
        setTimeout(() => {
            this.isInvincible = false;
            this.isHurt = false;
            if (this.global.health > 0) this.setStateOnce(this.onGround ? 'idle' : 'jump');
        }, this.invincibilityDuration * 1000);
    }

    /** Take damage */
    takeDamage() {
        if (this.global.health <= 0) return;
        if (!this.isInvincible) { // Nur Schaden, wenn nicht unverwundbar
            this.global.health -= 20;
            this.isInvincible = true;
            this.isHurt = true;
            this.setStateOnce('hurt');
            this.onGround = true;
            this.velocity.x = this.facingRight ? -150 : 150;
            this.velocity.y = -200;
            setTimeout(() => { this.velocity.y = 100; }, 250);
            this.global.audioManager.playSound('Hurt');
            this.removeInvincible();
        }
        this.isDead();
    }

    /**
     * Handle if is player was hit
     *
     * @param {*} other
     */
    onHit(other) {
        if (other.dead) return;
        this.velocity.y = 0;
        if (other) {
            this.velocity.y = Math.min(other.velocity.y, -200);  // Setzt den „Bounce“-Effekt nach oben
            other.squish();
            setTimeout(() => {
                this.velocity.y = 0;
            }, 300);
            return;
        }

    }

    /** Check if player is dead */
    isDead() {
        if (this.global.health <= 0) {
            this.setStateOnce('dead');
        }
    }

    /**
     * Set player state once
     *
     * @param {*} newState
     */
    setStateOnce(newState) {
        if (this.state !== newState) this.setState(newState);
    }



    /**
     * Handle if collision enter
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        const direction = this.getCollisionDirection(other);
        if (other.tag == "Enemy" && !this.onGround) {
            this.global.audioManager.playSound('Land');
        }
        if (other.tag === "Chicken" && !this.onGround) {
            this.global.audioManager.playSound('Land');
        }
    }
}
