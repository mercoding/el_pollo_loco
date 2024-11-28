import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Trigger extends CollisionCapable(GameObject) {
    constructor(collisionManager, x, y, width, height, groundLevel, tag = 'Trigger') {
        super(collisionManager, x, y, width, height, tag);
        this.groundLevel = groundLevel; // Das neue Ground-Level
    }

    

    onCollisionEnter(other) {
        if (other.tag === 'Player' && !(other.y + 25 > this.y)) {
            if(other.velocity.y != 0) return;
            other.velocity.y = 0;
            if((other.x >= this.x + 25  || other.x <= this.x - 25) && other.onGround && other.y <= this.y)
                other.velocity.y = 200;
        }
    }

    isPlayerAdjacent(other) {
        const buffer = 10; // Spielraum
        return (
            other.x + other.width < this.x - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width + buffer     // Charakter rechts vom Hindernis
        );
    }
    

    onCollisionExit(other) {
        if (other.tag === 'Player') {
            if(other.velocity.y != 0) return;
            const buffer = 10; // Spielraum für die Erkennung
            // Überprüfe, ob der Charakter sich außerhalb des Hindernisses befindet
            const isLeavingLeft = other.x <= this.x - buffer;
            const isLeavingRight = other.x >= this.x + this.width + buffer;
    
            // Setze `onGround` nur zurück, wenn der Charakter das Hindernis verlässt
            if (isLeavingLeft || isLeavingRight) {
                other.onGround = false; // Markiere, dass der Charakter nicht mehr auf dem Boden ist
            }
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
