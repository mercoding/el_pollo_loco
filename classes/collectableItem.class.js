import { CollisionCapable, GameObject } from "./gameObject.class.js";

/**
 * Class for collactable items like bottles or maybe health
 *
 * @export
 * @class CollectableItem
 * @typedef {CollectableItem}
 * @extends {CollisionCapable(GameObject)}
 */
export class CollectableItem extends CollisionCapable(GameObject) {
    static imageLoaded = false;
    ctx;
    deltaTime;
    global;

    constructor(imgPath, collisionManager, ...args) {
        super(collisionManager, ...args);
        this.dead = false;
        this.imgPath = imgPath;
        this.itemImage = new Image();
        this.itemImage.src = imgPath;
        this.isInvincible = false;
        setTimeout(() => { this.destroyItem(); }, 5000);
        this.updateCollider();
    }

    Start() {
        //this.global.audioManager.loadSound('Coin', 'audio/Coins_Single_01.wav');
    }

    /**
     * Update function
     *
     * @param {*} ctx
     * @param {*} deltaTime
     * @param {*} screenX
     */
    Update(ctx, deltaTime, screenX) {
        if (this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(this.itemImage, screenX, this.y, this.width, this.height);
        }
        this.onCollisionStay();
        this.updateCollider();
    }

    /**
     * Check if object is visible on canvas
     *
     * @param {*} screenX
     * @param {*} canvasWidth
     * @returns {boolean}
     */
    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }

    /** Check if collision is on stay */
    onCollisionStay() {
        if (this.collidingWith == null) return;
        if (this.collidingWith.tag === "Player" && !this.collidingWith.onGround) {
            if (this.tag === "Bottle" && this.global.bottles < 10) this.destroyItem();
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
     * Check if collision enter 
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        if (other.tag == 'Player') {
            other.onGround = 505;
            
            if (this.tag === "Bottle" && this.global.bottles < 10) {
                if (this.y > 290) {
                    this.global.bottles++;
                    setTimeout(() => {
                        this.destroyItem();
                    }, 150);
                }
            }
        }
    }

    /** Destroy item */
    destroyItem() {
        if (this.collisionManager && !this.dead) {
            this.dead = true;
            this.collidingWith = null;
            this.collisionManager.destroy(this);
            this.global.destroy(this);
        }
    }
}