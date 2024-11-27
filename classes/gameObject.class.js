import { Character } from "./character.class.js";

export class GameObject {
    constructor(x, y, width, height, tag = 'untagged') {
        this.x = x; // Mitte des Objekts
        this.y = y; // Mitte des Objekts
        this.width = width;
        this.height = height;
        this.tag = tag;
    }
}

export const CollisionCapable = (Base) => class extends Base {
    constructor(collisionManager, ...args) { 
        super(...args);
        this.collisionManager = collisionManager;

        // Collider wird als quadratisches Rechteck definiert
        this.collider = {
            x: this.x - this.width / 2,
            y: this.y + this.height / 2,
            width: this.width,
            height: this.height
        };
        this.collidingWith = null; //
    }

    updateCollider() {
        this.collider.x = this.x;
        this.collider.y = this.y;
        this.collider.width = this.width;
        this.collider.height = this.height;
    }
    
    
    

    // Zeichne das Objekt basierend auf der Mitte
    draw(ctx) {
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    

    // Prüfe auf Kollision mit einem anderen Objekt
    isCollidingWith(other) {
        if (!other || !other.collider) return false;
        return (
            this.collider.x < other.collider.x + other.collider.width &&
            this.collider.x + this.collider.width > other.collider.x &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }

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
    

    onCollisionEnter(other) {
        this.collidingWith = other;
        /*const direction = this.getCollisionDirection(other);

        if (direction) {
            console.log(`Collision detected from: ${direction}`);
        }*/

        // Falls das andere Objekt auch eine `onCollisionEnter`-Methode hat
        if (other && typeof other.onCollisionEnter === 'function' && other.collidingWith !== this) {   
            other.collidingWith = this;
            other.onCollisionEnter(this);
        }
    }

    onCollisionExit(other) {
        if (other.tag === "Player" && other.velocity) {
            other.velocity.x = 0;
            other.velocity.y = 0;
        }
        this.collidingWith = null;
    }
    

    // Prüfe und verwalte Kollisionen
    updateCollision(other) {
        if (!other || !other.collider) return;

        if (this.isCollidingWith(other)) {
            this.onCollisionEnter(other);
        } else if (this.collidingWith === other) {
            this.onCollisionExit();
        }
    }
};
