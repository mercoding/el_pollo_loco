import { bottleExplodeAnimations } from '../animations/explode.anim.js';
import { AudioManager } from './AudioManager.class.js';
import { Chicken } from './chicken.class.js';
import { ChickenBoss } from './chickenBoss.class.js';
import { Explosion } from './explosion.class.js';
import { CollisionCapable, GameObject } from './gameObject.class.js';
import { Animatable, MovableObject } from './movableObject.class.js';

/**
 * Class for bottle item
 *
 * @export
 * @class Bottle
 * @typedef {Bottle}
 * @extends {Animatable(MovableObject)}
 */
export class Bottle extends Animatable(MovableObject) {
    constructor(animationPaths, collisionManager, global, x, y, width, height, velocityX, velocityY, tag = 'Bottle') {
        super(animationPaths, collisionManager, x, y, width, height, tag);
        this.global = global;
        this.velocity = { x: velocityX, y: velocityY }; // Startgeschwindigkeit
        this.gravity = 800; // Gravitation
        this.hasExploded = false;
        this.explosionRadius = 50; // Explosionsradius
        this.global.collisionManager.addObject(this);
        this.state = 'rotation';
        this.hit = false;
        this.audioManager = new AudioManager();
        this.audioManager.loadSound('Explosion', 'audio/GGGrasslands - Box Destroy.wav');
        this.audioManager.effectsVolume = 0.5;
        this.audioManager.currentTime = 0;
    }

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        if (this.hasExploded) return; // Nichts tun, wenn bereits explodiert
        this.velocity.y += this.gravity * deltaTime;
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        this.drawBottle(ctx, screenX);
        if (this.y + this.height >= this.global.groundLevel) {
            this.explode();
        }
        this.updateAnimation(deltaTime);
        this.updateCollider();
    }


    /**
     * Draw bottle
     *
     * @param {*} ctx
     * @param {*} screenX
     */
    drawBottle(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            ctx.translate(screenX, this.y);
            ctx.scale(1, 1);
            ctx.drawImage(frame, -5, -5, this.width + 20, this.height + 10);
            ctx.restore();
        }
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
     * Calculate distance for collision
     *
     * @param {*} other
     * @returns {*}
     */
    calculateDistance(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Handle hit on chicken enemy
     *
     * @param {*} other
     */
    hitChickenBoss(other) {
        setTimeout(() => {
            other.onHit(this);
            if (other.health <= 0) this.global.bossDefeated++;
            this.explode();
        }, 200);
    }

    /**
     * Check if chicken enemy collider is on the edge of collider
     *
     * @param {*} other
     * @returns {boolean}
     */
    isChickenAdjacent(other) {
        const buffer = 5; // Spielraum
        return (
            other.x < this.x + this.width / 2 - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width / 2 + buffer   // Charakter rechts vom Hindernis
        );
    }

    /**
     * Check if collision enter
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (other.tag === "Ground" || other.tag === "Enemy" || other.tag === "Obstacle") {
            const distanceToPlayer = this.x - other.x;
            const distance = Math.abs(distanceToPlayer);
            if (other instanceof ChickenBoss && !this.hit) {
                this.hitChickenBoss(other);
                this.hit = true;
            }
            else if (other instanceof Chicken) {
                if (other.tag === "Enemy") other.onHit(this);
                this.explode();
            }
        }
    }

    /** Start explode effect spawm explosion game object */
    explode() {
        this.hasExploded = true;
        this.global.addGameObject(new Explosion(bottleExplodeAnimations, this.collisionManager, this.global, this.x, this.y, this.explosionRadius)); // Explosionseffekt hinzufügen
        this.global.destroy(this);
        this.global.collisionManager.destroy(this);
    }
}
