import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Trigger extends CollisionCapable(GameObject) {
    constructor(collisionManager, x, y, width, height, groundLevel, tag = 'Trigger') {
        super(collisionManager, x, y, width, height, tag);
        this.groundLevel = groundLevel; // Das neue Ground-Level
    }

    

    onCollisionEnter(other) {
        if (other.tag === 'Player') {
            other.velocity.y = 0;
            if((other.x >= this.x + 25  || other.x <= this.x - 25) && other.onGround && other.y <= this.y)
                other.velocity.y = 200;
        }
    }

    

    onCollisionExit(other) {
        //console.log(`Trigger aktiviert für ${other.tag}`);
        if (other.tag === 'Player') {
            if((other.x >= this.x + 25  || other.x <= this.x - 25) && other.onGround && other.y <= this.y)
                other.velocity.y = 200;
        }
    }

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
}
