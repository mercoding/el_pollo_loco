import { Chicken } from "./chicken.class.js";
import { CollisionCapable, GameObject } from "./gameObject.class.js";

/**
 * Class which create obstacle which player cannot walking through
 * but possible to land on it
 *
 * @export
 * @class Obstacle
 * @typedef {Obstacle}
 * @extends {CollisionCapable(GameObject)}
 */
export class Obstacle extends CollisionCapable(GameObject) {
    static imageLoaded = false;
    global;

    constructor(imgPath, collisionManager, ...args) {
        super(collisionManager, ...args);
        this.dead = false;
        this.imgPath = imgPath;
        this.obstacleImage = new Image();
        this.obstacleImage.src = imgPath;
        this.isInvincible = false;

        this.updateCollider();
    }

    Start() {}

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        this.ctx = ctx;
        deltaTime = deltaTime;
        // Only render the obstacle if it is visible on the canvas
        if (this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(this.obstacleImage, screenX, this.y, this.width, this.height);
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
     * Check if player collides on side and stop moving of player
     *
     * @param {*} other
     * @param {*} direction
     */
    isPlayerCollisionFromSide(other, direction) {
        if (direction === 'left') {            
            if(other.velocity.x > 0) {
                other.velocity.x = 0; 
                other.x = this.x - this.width + 40;
                other.idle();
            }
        }
        else if(direction === 'right') {
            if(other.velocity.x < 0) {
                other.velocity.x = 0; 
                other.x = this.x + this.width + 10;
                other.idle();
            }
        }
    }

    /**
     * Check if player leave obstacle on top
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
     * Check if game object like player enter collider
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            
            if (direction === 'top') {
                // Berechne die Differenz, falls der Charakter über dem Hindernis schwebt
                const imageOffset = 82; // Passe diesen Wert an die Höhe des Bildes an
                other.y = this.collider.y - other.collider.height + imageOffset;
                if(!this.isPlayerAdjacent(other))
                    other.land(); // Charakter landet
            } else {
                this.isPlayerCollisionFromSide(other, direction);
            }
        }
    }

    /**
     * Check if obstacle is visible on canvas
     *
     * @param {*} screenX
     * @param {*} canvasWidth
     * @returns {boolean}
     */
    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
