import { Chicken } from "./chicken.class.js";
import { CollisionCapable, GameObject } from "./gameObject.class.js";

/**
 * Class for set ground object and set ground level for all game objects
 *
 * @export
 * @class Ground
 * @typedef {Ground}
 * @extends {CollisionCapable(GameObject)}
 */
export class Ground extends CollisionCapable(GameObject) {
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
    
    /**
     * Check if player collision comes from side
     *
     * @param {*} other
     * @param {*} direction
     */
    isPlayerCollisionFromSide(other, direction) {
        if (direction === 'left') {            
            if(other.velocity.x > 0) {
                other.velocity.x = 0; // Stoppe Bewegung horizontal
                other.x = this.x - this.width + 40;
                other.idle();
            }
        }
        else if(direction === 'right') {
            if(other.velocity.x < 0) {
                other.velocity.x = 0; // Stoppe Bewegung horizontal
                other.x = this.x + this.width + 10;
                other.idle();
            }
        }
    }

    /**
     * Check if Player leave top
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
     * Check if game object collides or stop falling
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (other.tag === 'Player' || other.tag === 'Enemy') {
            const direction = this.getCollisionDirection(other);
            
            if (direction === 'top') {
                // Berechne die Differenz, falls der Charakter über dem Hindernis schwebt
                const imageOffset = 82; // Passe diesen Wert an die Höhe des Bildes an
                if (other.tag === 'Player') other.y = this.collider.y - other.collider.height / 2;
                else other.y = this.collider.y - other.collider.height;
                //if(!this.isPlayerAdjacent(other))
                    other.land(); // Charakter landet
            } else {
                this.isPlayerCollisionFromSide(other, direction);
            }
        }
    }
}
