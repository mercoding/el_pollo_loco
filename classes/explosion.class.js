import { AudioManager } from "./AudioManager.class.js";
import { GameObject } from "./gameObject.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

/**
 * Class for animate bottle explosion
 *
 * @export
 * @class Explosion
 * @typedef {Explosion}
 * @extends {Animatable(MovableObject)}
 */
export class Explosion extends Animatable(MovableObject) {
    constructor(bottleExplodeAnimations, collisionManager, global, x, y, radius, tag = 'Explosion') {
        super(bottleExplodeAnimations, collisionManager, x, y, radius * 2, radius * 2, tag);
        this.global = global;
        this.radius = radius;
        this.timer = 0; // Zeit, wie lange die Explosion sichtbar bleibt
        this.duration = 0.5; // 0.5 Sekunden
        this.state = 'explode';
        this.global.audioManager.currentTime = 0;
        this.global.audioManager.playSound('Explosion'); 
        this.play = false;
        
    }

    /**
     * Update functzion for update animation
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        this.timer += deltaTime;   
        if (this.timer >= this.duration) {
            this.global.destroy(this);
            this.global.collisionManager.destroy(this);
            return;
        }
        this.drawSplash(ctx, screenX);
    }

    /**
     * Draw splash image
     *
     * @param {*} ctx
     * @param {*} screenX
     */
    drawSplash(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            ctx.translate(screenX, this.y);
            ctx.scale(1, 1);
            ctx.drawImage(frame, -5, -5, this.width, this.height);
            ctx.restore();
        }        
    }
}
