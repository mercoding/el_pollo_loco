export class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collider = { x: this.x, y: this.y, width: this.width, height: this.height };
    }

    updateCollider() {
        this.collider.x = this.x;
        this.collider.y = this.y;
    }

    isCollidingWith(other) {
        return (
            this.collider.x < other.collider.x + other.collider.width &&
            this.collider.x + this.collider.width > other.collider.x &&
            this.collider.y < other.collider.y + other.collider.height &&
            this.collider.y + this.collider.height > other.collider.y
        );
    }

    getHitbox() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height - 25
        };
    }
}
