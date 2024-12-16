
/**
 * Class for game objects with main description like position x, y or width and height
 *
 * @export
 * @class GameObject
 * @typedef {GameObject}
 */
export class GameObject {
    constructor(x, y, width, height, tag = 'untagged') {
        this.x = x; // Mitte des Objekts
        this.y = y; // Mitte des Objekts
        this.width = width;
        this.height = height;
        this.tag = tag;
    }
}

/**
 * Descripes if game object has collider
 *
 * @param {*} Base
 * @returns {typeof (Anonymous class)}
 */
export const CollisionCapable = (Base) => class extends Base {
    constructor(collisionManager, ...args) { 
        super(...args);
        this.collisionManager = collisionManager;
        this.collider = {
            x: this.x - this.width / 2,
            y: this.y + this.height / 2,
            width: this.width,
            height: this.height
        };
        this.collidingWith = null; 
    }

    /** Update collider */
    updateCollider() {
        this.collider.x = this.x;
        this.collider.y = this.y;
        this.collider.width = this.width;
        this.collider.height = this.height;
    }
    
    
    

    /**
     * Draw collider
     *
     * @param {*} ctx
     */
    draw(ctx) {
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    

    /**
     * Check if collider colliding with each other collider
     *
     * @param {*} other
     * @returns {boolean}
     */
    isCollidingWith(other) {
        if (!other || !other.collider) return false;
        return (
            this.collider.x < other.collider.x + other.collider.width &&
            this.collider.x + this.collider.width > other.collider.x &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }

    /**
     * Get collision direction
     *
     * @param {*} other
     * @returns {("left" | "right" | "top" | "bottom")}
     */
    getCollisionDirection(other) {
        if (!this.isCollidingWith(other)) return null;
    
        const dx = (this.collider.x + this.collider.width / 2) - (other.collider.x + other.collider.width / 2);
        const dy = (this.collider.y + this.collider.height / 2) - (other.collider.y + other.collider.height / 2);
    
        const overlapX = this.collider.width / 2 + other.collider.width / 2 - Math.abs(dx);
        const overlapY = this.collider.height / 2 + other.collider.height / 2 - Math.abs(dy);
    
        if (overlapX < overlapY) {
            return dx > 0 ? 'left' : 'right';
        } else {
            return dy > 0 ? 'top' : 'bottom';
        }
    }
    

    /**
     * Check if an object enter collider
     *
     * @param {*} other
     */
    onCollisionEnter(other) {
        this.collidingWith = other;
        if (other && typeof other.onCollisionEnter === 'function' && other.collidingWith !== this) {   
            other.collidingWith = this;
            other.onCollisionEnter(this);
        }
    }

    /**
     * Check if an object leave collider
     *
     * @param {*} other
     */
    onCollisionExit(other) {
        if (other.tag === "Player" && other.velocity) {
            other.velocity.x = 0;
            other.velocity.y = 0;
        }
        this.collidingWith = null;
    }
    

    /**
     * Update collision
     *
     * @param {*} other
     */
    updateCollision(other) {
        if (!other || !other.collider) return;

        if (this.isCollidingWith(other)) {
            this.onCollisionEnter(other);
        } else if (this.collidingWith === other) {
            this.onCollisionExit();
        }
    }
};
