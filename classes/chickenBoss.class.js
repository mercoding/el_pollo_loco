import { IdleState } from "./AI/idleState.class.js";
import { StateMachine } from "./AI/stateMachine.class.js";
import { AudioManager } from "./AudioManager.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

/**
 * Class for end boss
 *
 * @export
 * @class ChickenBoss
 * @typedef {ChickenBoss}
 * @extends {Animatable(MovableObject)}
 */
export class ChickenBoss extends Animatable(MovableObject) {
    global;
    healthStatusBar = new Image();
    healthStatus = {
        0: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue0.png' },
        20: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue20.png' },
        40: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue40.png' },
        60: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue60.png' },
        80: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue80.png' },
        100: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue100.png' }
    };

    constructor(animationPaths, collisionManager, player, x, ...args) {
        super(animationPaths, collisionManager, x, ...args);
        this.facingRight = true;
        this.setState('idle');
        this.mainSettings(player, x);
        this.stateMachine = new StateMachine(new IdleState(this));
        this.attackSettings();
        this.Start();
    }

    /**
     * Set main settings
     *
     * @param {*} player
     * @param {*} x
     */
    mainSettings(player, x) {
        this.player = player;
        this.startPosition = x;
        this.speed = 50;
        this.gravity = 800;
        this.onGround = true;
        this.dead = false;
        this.frameDuration = 0.3;
        this.currentDistanceToPlayer;
        this.health = 100;
        this.hitCount = 0;
    }

    /** Set attack settings */
    attackSettings() {
        this.attackDistanceThreshold = 180;
        this.playerInAttackDistance = 300;
        this.targetPosition = 0;
        this.returning = false;
        this.attackTriggered = false;
        this.attackAnimationComplete = false;
    }

    /** Set stats on start */
    Start() {
        this.audioManager = new AudioManager();
        this.audioManager.effectsVolume = 0.2;
        this.audioManager.loadSound('Bot1', 'audio/Bot12.wav');
        this.audioManager.loadSound('Bot2', 'audio/Bot11.wav');
        this.audioManager.loadSound('BotAttack', 'audio/Bakaa11.wav');
        this.soundRepeatCounter = 0;
        this.soundIndex = 0;
        this.soundCooldown = 0;
        this.cooldownDuration = 0.5;
        this.soundRepeatCounter = 0;
    }

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        this.audioManager.effectsVolume = this.global.getSoundVolumes();
        this.isOnGround(deltaTime);
        this.facingRight = this.player.x < this.x;
        this.currentDistanceToPlayer = this.calculateDistanceToPlayer();
        this.stateMachine.Update(deltaTime);
        this.drawChicken(ctx, screenX);
        this.drawHealthBar(ctx, this.calculateBottlePercentage(this.hitCount), screenX + this.width / 2 - 100, this.y - 20);
        if (this.global.pause) return;
        this.updateAnimation(deltaTime);
        if (this.isDead()) return;
        if (this.soundCooldown > 0) this.soundCooldown -= deltaTime;
        this.playWalkingSound();
        this.move(deltaTime);
        this.updateCollider();
    }

    /**
     * Set dead state
     *
     * @returns {boolean}
     */
    isDead() {
        if (this.health <= 0) {
            this.setState('dead');
            return true;
        }
        return false;
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

    /**
     * Draw chicken boss
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
        if (this.velocity.x !== 0 && this.soundCooldown <= 0) {
            let sound;
            if (this.soundRepeatCounter < 3) {
                sound = 'Bot1';
                this.soundRepeatCounter++;
            } else {
                sound = 'Bot2';
                this.soundRepeatCounter = 0; // Zurücksetzen für den nächsten Zyklus
            }
            this.audioManager.playSound(sound);
            this.soundCooldown = this.cooldownDuration; // Setze den Cooldown zurück
        }
    }


    /**
     * Draw health bar
     *
     * @param {*} ctx
     * @param {*} percent
     * @param {*} x
     * @param {*} y
     */
    drawHealthBar(ctx, percent, x, y) {
        this.healthStatusBar.src = percent > 0 ? this.healthStatus[percent].path : this.healthStatus['0'].path;
        ctx.drawImage(this.healthStatusBar, x, y, 200, 50);
    }

    /**
     * Calculate bottle hits into percentage
     *
     * @param {*} hitCount
     * @returns {(100 | 80 | 60 | 40 | 20 | 0)}
     */
    calculateBottlePercentage(hitCount) {
        const maxHealth = 10;
        const percentage = (hitCount / maxHealth) * 100;
        if (percentage >= 100) return 100;
        if (percentage >= 80) return 80;
        if (percentage >= 60) return 60;
        if (percentage >= 40) return 40;
        if (percentage >= 20) return 20;
        return 0;
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
    }

    /**
     * Calculate distance to player
     *
     * @returns {*}
     */
    calculateDistanceToPlayer() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Move game object
     *
     * @param {*} deltaTime
     */
    move(deltaTime) {
        super.move(deltaTime);
    }

    /**
     * Check if game object is on ground
     *
     * @param {*} deltaTime
     */
    isOnGround(deltaTime) {
        if (!this.onGround) {
            this.velocity.y += this.gravity * deltaTime; // Gravitationskraft addieren
        }
        if (this.y + this.height >= this.ground) { // Bodenhöhe hier auf `400` festgelegt
            this.y = this.ground - this.height; // Charakter auf dem Boden halten
            this.land(); // Charakter landet und Animation wird zurückgesetzt
        }
    }

    /** Land game object */
    land() {
        this.onGround = true;
        this.velocity.y = 0;
        if (this.state == 'jump') this.setState('idle');
    }



    /**
     * Calculate return position to move
     *
     * @param {*} boss
     * @returns {*}
     */
    calculateReturnPosition(boss) {
        // Define the offset distance you want the boss to maintain from the player
        const offsetDistance = (this.player.x < boss.x) ? 250 : -250;

        // Determine the boss's target return position based on the player's position
        if (this.player.x < boss.x) {
            // If the player is to the left, position the boss to the right of the player
            return this.player.x + offsetDistance;
        } else {
            // If the player is to the right, position the boss to the left of the player
            return this.player.x - offsetDistance;
        }
    }


    /**
     * Handle if player hit with a bottle
     *
     * @param {*} other
     */
    onHit(other) {
        if (this.dead) return;
        if (this.health > 0) {
            this.hitCount += 2;
            this.health -= 20;
        }
        else {
            this.global.bossDefeated++;
            this.setState('dead');
            this.stateMachine.changeState('dead');
            this.dead = true;
        }
    }

    /**
     * Check if Player is on side
     *
     * @param {*} other
     * @returns {boolean}
     */
    isPlayerAdjacent(other) {
        if(!other.onGround) return;
        const buffer = 22; // Spielraum
        return (
            other.x < this.x + this.width / 2 - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width / 2 + buffer   // Charakter rechts vom Hindernis
        );
    }


    /**
     * Check if player enter collider
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (other.tag === "Player" && this.health > 0) {
            const direction = this.getCollisionDirection(other);
            if ((direction === 'left' || direction === 'right')) {
                if(!this.isPlayerAdjacent(other)) other.takeDamage();
            }
        }
    }
}
