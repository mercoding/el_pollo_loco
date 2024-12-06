import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Trigger extends CollisionCapable(GameObject) {
    constructor(collisionManager, ...args) {
        super(collisionManager, ...args);
        //this.groundLevel = groundLevel; // Das neue Ground-Level
        
        this.updateCollider();
        //this.onCollisionStay();
    }

    onCollisionStay() {
        if (this.collidingWith == null) return;
        if (this.collidingWith.tag === "Player") {
            console.log(collidingWith);
            const buffer = 25;
            const isLeavingLeft = collidingWith.x < this.x + this.width - buffer;
            const isLeavingRight = collidingWith.x > this.x + this.width + buffer;
    
            // Setze `onGround` nur zurück, wenn der Charakter das Hindernis verlässt
            if (collidingWith.onGround == 0 && (isLeavingLeft || isLeavingRight)) {
                collidingWith.onGround = false; // Markiere, dass der Charakter nicht mehr auf dem Boden ist
                collidingWith.ground = 505;
                collidingWith.velocity.y = 200;
                collidingWith.collidingWith = null;
            }
        }
    }
    

    onCollisionEnter(other) {
        if(this.collidingWith !== null) return;
        if (other.tag === 'Player' && !(other.y + 25 > this.y)) {
            console.log("trigger Enter");
            //console.log(other);
            if(other.velocity.y != 0) return;
            //other.velocity.y = 0;
            const buffer = 5;
            const isLeavingLeft = other.x < this.x + this.width - buffer;
            const isLeavingRight = other.x > this.x + this.width + buffer;
    
            // Setze `onGround` nur zurück, wenn der Charakter das Hindernis verlässt
            if (other.onGround == 0 && (isLeavingLeft || isLeavingRight)) {
                //other.onGround = false; // Markiere, dass der Charakter nicht mehr auf dem Boden ist
                other.ground = 505;
                //other.velocity.y = 200;
                other.collidingWith = null;
            }
            //if((other.x >= this.x + 25  || other.x <= this.x - 25) && other.onGround && other.y <= this.y)
                //other.velocity.y = 200;
        }
    }

    isPlayerAdjacent(other) {
        const buffer = 5; // Spielraum
        return (
            other.x < this.x + this.width - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width + buffer     // Charakter rechts vom Hindernis
        );
    }
    

    onCollisionExit(other) {
        if (other.tag === 'Player') {
            if(other.velocity.y != 0) return;
            console.log("trigger Exit");
            
            const buffer = 5; // Spielraum für die Erkennung
            // Überprüfe, ob der Charakter sich außerhalb des Hindernisses befindet
            const isLeavingLeft = other.x < this.x + this.width - buffer;
            const isLeavingRight = other.x > this.x + this.width + buffer;
    
            // Setze `onGround` nur zurück, wenn der Charakter das Hindernis verlässt
            if (isLeavingLeft || isLeavingRight) {
                //other.onGround = false; // Markiere, dass der Charakter nicht mehr auf dem Boden ist
                other.ground = 505;
                //other.velocity.y = 200;
                other.collidingWith = null;
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
