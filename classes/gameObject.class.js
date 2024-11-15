export class GameObject {
    constructor(x, y, width, height, tag = 'untagged') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.tag = tag;
    }
}


export const CollisionCapable = (Base) => class extends Base {
    constructor(collisionManager, ...args) { 
        super(...args);
        this.collisionManager = collisionManager;
        this.collider = { x: this.x, y: this.y, width: this.width + 20, height: this.height - 25 };
        this.collidingWith = null;
    }

    updateCollider() {
        this.collider.x = this.x;
        this.collider.y = this.y;
    }

    isCollidingWith(other) {
        if(other !== undefined) return (
            this.collider.x < other.collider.x + other.collider.width &&
            this.collider.x + this.collider.width > other.collider.x &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }

    getHitbox() {
        return {
            left: this.x - this.width,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    onCollisionEnter(other) {
        this.collidingWith = other;
        if (other && typeof other.onCollisionEnter === 'function' && other.collidingWith !== this) {   
            //console.log(other);
            other.collidingWith = this;
                     
            other.onCollisionEnter(other);
        }
    }
    
    onCollisionExit() { this.collidingWith = null; }

    updateCollision(other) {
        //console.log(other);
        
        if (!other || !other.collider) return;
        if (this.isCollidingWith(other)) {
            if (this.collidingWith !== other) {                
                this.onCollisionEnter(other);  
            }
        } else if (this.collidingWith === other) {
            this.onCollisionExit();
        }
    }
    
    
}
