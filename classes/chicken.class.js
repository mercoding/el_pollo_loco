import { bottleAnimations } from "../animations/bottle.anim.js";
import { pepeAnimations } from "../animations/character.anim.js";
import { AudioManager } from "./AudioManager.class.js";
import { Bottle } from "./bottle.class.js";
import { CollectableItem } from "./collectableItem.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

/**
 * Chicken enemy which walking between obstacles destroyable with
 * jump on top or bottle throw
 *
 * @export
 * @class Chicken
 * @typedef {Chicken}
 * @extends {Animatable(MovableObject)}
 */
export class Chicken extends Animatable(MovableObject) {
    squishAudio = new Audio('audio/GGGrasslands - Box Destroy.wav');
    constructor(animationPaths, collisionManager, global, x, y, ...args) {
        super(animationPaths, collisionManager, x, y, ...args);
        this.global = global;
        this.facingRight = true;
        this.setState('walk');
        this.speed = 50;
        this.dead = false;
        this.gravity = 800;
        this.onGround = true;
        this.touched = false;
        this.invincibilityDuration = 2.0;
        this.Start();
    }

    /** Set stats on start */
    Start() {
        this.lastDamageTime = 0;
        this.soundIndex = 0;
        this.soundCooldown = 0;
        this.cooldownDuration = 0.5;
        this.soundRepeatCounter = 0;
        this.audioManager = new AudioManager();
        this.audioManager.effectsVolume = 0.2;
        this.audioManager.loadSound('Bot1', 'audio/Bot1.wav');
        this.audioManager.loadSound('Bot2', 'audio/Bot2.wav');
        this.audioManager.loadSound('Squish', 'audio/Bakaa4.wav');
    }

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        this.drawChicken(ctx, screenX);
        this.audioManager.effectsVolume = this.global.getSoundVolumes();
        if (this.dead) return;
        if (this.global.pause || this.global.gameOver) return;
        this.isOnGround(deltaTime);
        this.move(deltaTime);
        this.updateAnimation(deltaTime);
        if (this.soundCooldown > 0) this.soundCooldown -= deltaTime;
        if (this.velocity.x !== 0 && this.soundCooldown <= 0) {
            this.playWalkingSound();
            this.soundCooldown = this.cooldownDuration;
        }
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
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            this.collider.x - cameraX,
            this.collider.y,
            this.collider.width,
            this.collider.height
        );
        ctx.restore();
    }



    /**
     * Draw chicken
     *
     * @param {*} ctx
     * @param {*} screenX
     */
    drawChicken(ctx, screenX) {
        const frame = this.getCurrentFrame();
        if (frame) {
            ctx.save();
            if (!this.facingRight) this.moveLeft(frame, ctx, screenX);
            else this.moveRight(frame, ctx, screenX);
            ctx.restore();
        }
    }

    /** Play walking sound */
    playWalkingSound() {
        let sound;
        if (this.soundRepeatCounter < 3) {
            sound = 'Bot2';
            this.soundRepeatCounter++;
        } else {
            sound = 'Bot1';
            this.soundRepeatCounter = 0;
        }
        this.audioManager.playSound(sound);
    }

    /**
     * Draw chicken image facing to left
     *
     * @param {*} frame
     * @param {*} ctx
     * @param {*} screenX
     */
    moveLeft(frame, ctx, screenX) {
        ctx.translate(screenX + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
        this.setVelocity(1, 0);
    }

    /**
     * Draw chicken image facing to right
     *
     * @param {*} frame
     * @param {*} ctx
     * @param {*} screenX
     */
    moveRight(frame, ctx, screenX) {
        ctx.translate(screenX, this.y);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
        this.setVelocity(-1, 0);
    }

    /**
     * Set bouncing effect if player jump on it
     *
     * @param {*} other
     */
    setBounceAfterSquish(other) {
        if (other.tag === "Player") {
            setTimeout(() => { other.velocity.y = Math.min(other.velocity.y, -150); }, 100);
            setTimeout(() => { other.velocity.y = 100; }, 250);
        }
    }


    /**
     * Draw squish effect if player jump on it and destroy chicken
     *
     * @param {*} other
     */
    squish(other) {
        if (!this.isSquished) {
                this.y += 13;
                this.collider.y += 25;
                this.collider.height -= 30;
                this.setBounceAfterSquish(other);
                this.global.audioManager.playSound('Squish');
                this.isSquished = true; // Gegner als zerquetscht markieren
                this.velocity.x = 0;
                setTimeout(() => {this.setState('dead');}, 70);
                this.onDeath();
                this.dead = true;
                this.collidingWith = null;
                this.collisionManager.destroy(this);
        }
    }

    /**
     * Handle hit if player jump on it
     *
     * @param {*} other
     */
    onHit(other) {
        if (this.dead) return;
        if (!this.dead) {
            this.global.audioManager.loadSound('Squish', 'audio/Bakaa4.wav');
            this.global.audioManager.playSound('Squish');
            this.global.audioManager.stopSound('Bot1');
            this.global.audioManager.stopSound('Bot2');
            this.squish(other);
            this.dead = true;
        }
    }

    /**
     * Handle collision on obstacles and move into another direction
     *
     * @param {*} other
     */
    ifCollisionOnObstacle(other) {
        if (other.tag === 'Obstacle' || other.tag === 'Cactus') {
            if (!this.touched) {
                this.velocity.x *= -1;
                this.facingRight = !this.facingRight;
                this.touched = true;
                setTimeout(() => {
                    this.touched = false;
                }, 2000);
            }
        }
    }

    /**
     * Handle collision on player and set damage to player if it not jumped on top
     *
     * @param {*} other
     */
    ifCollisionOnPlayer(other) {
        if (other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            if ((direction === 'left' || direction === 'right')) {
                if (this.isPlayerAdjacent(other) && other.onGround) other.takeDamage();
            }
            if (direction === 'top' && other.velocity.y > 0) {
                other.setState('jump');
                if (this.isPlayerAdjacentOnTop(other)) this.onHit(other);
            }
        }
    }

    /**
     * Check if player is on side of collider
     *
     * @param {*} other
     * @returns {boolean}
     */
    isPlayerAdjacent(other) {
        const buffer = 10;
        if (!other || !other.collider) return false;
        return (
            this.collider.x + buffer < other.collider.x + other.collider.width - buffer &&
            this.collider.x + this.collider.width - buffer > other.collider.x + buffer &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }

    /**
     * Check if player is on side of collider
     *
     * @param {*} other
     * @returns {boolean}
     */
    isPlayerAdjacentOnTop(other) {
        const buffer = 15;
        if (!other || !other.collider) return false;
        return (
            this.collider.x + buffer < other.collider.x + other.collider.width - buffer &&
            this.collider.x + this.collider.width - buffer > other.collider.x + buffer &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }


    /**
     * Check if collider enter 
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (this.global.pause) return;
        if (this.dead) return;
        this.ifCollisionOnObstacle(other);
        this.ifCollisionOnPlayer(other);

        if (other.tag === 'Explosion') {
            other.onCollisionEnter(this);
        }
    }

    /** Handle on death */
    onDeath() {
        const numBottles = Math.floor(Math.random(0, 10) * 10);
        if (numBottles > 3) return;
        const bottle = new CollectableItem("img/bottle/rotation/R-1.png", this.global.collisionManager, this.x, this.y - 50, 50, 60, 'Bottle');
        bottle.global = this.global;
        this.global.addGameObject(bottle);
        this.global.collisionManager.addObject(bottle);
    }

    /**
     * Check if is on ground
     *
     * @param {*} deltaTime
     */
    isOnGround(deltaTime) {
        if (!this.onGround || this.collidingWith === null) {
            this.velocity.y += this.gravity * deltaTime;
        }
    }

    /** Land game object and stop falling */
    land() {
        this.onGround = true;
        this.velocity.y = 0;
    }
}
