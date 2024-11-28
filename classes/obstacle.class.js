import { Chicken } from "./chicken.class.js";
import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Obstacle extends CollisionCapable(GameObject) {
    static obstacleImage = new Image();
    static imageLoaded = false;
    ctx;
    deltaTime;
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

    Update(ctx, deltaTime, screenX) {
        this.ctx = ctx;
        deltaTime = deltaTime;
        // Only render the obstacle if it is visible on the canvas
        if (this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(this.obstacleImage, screenX, this.y, this.width, this.height);
        }
        this.updateCollider();
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

    isPlayerAdjacent(other) {
        const buffer = 5; // Spielraum
        return (
            other.x + other.width < this.x - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width + buffer     // Charakter rechts vom Hindernis
        );
    }
    

    
    onCollisionEnter(other) {
        if (other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            
            if (direction === 'top') {
                // Berechne die Differenz, falls der Charakter über dem Hindernis schwebt
                const imageOffset = 82; // Passe diesen Wert an die Höhe des Bildes an
                other.y = this.collider.y - other.collider.height + imageOffset;
                other.land(); // Charakter landet
            } else {
                this.isPlayerCollisionFromSide(other, direction);
            }
        }
    }
    
    

    

    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
