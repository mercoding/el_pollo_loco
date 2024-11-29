import { CollisionCapable, GameObject } from './gameObject.class.js';
import { Obstacle } from './obstacle.class.js';

export class Cactus extends CollisionCapable(GameObject) {
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
        this.touchTimer = 0; // Zeit, die der Charakter den Kaktus berührt
        this.damageCooldown = 1; // Sekunden zwischen Schaden
        this.lastDamageTime = 0; // Zeitstempel für den letzten Schaden

        this.updateCollider();
    }

    Start() { }

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
            if (other.velocity.x > 0) {
                other.velocity.x = 0; // Stoppe Bewegung horizontal
                other.x = this.x - this.width + 30;
                other.idle();
            }
        }
        else if (direction === 'right') {
            if (other.velocity.x < 0) {
                other.velocity.x = 0;
                other.x = this.x + this.width + 10;
                other.idle();

            }
        }
    }

    isPlayerAdjacent(other) {
        const buffer = 5; // Spielraum
        return (
            other.x < this.x + this.width / 2 - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width / 2 + buffer   // Charakter rechts vom Hindernis
        );
    }



    onCollisionEnter(other) {
        if (other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            const currentTime = performance.now() / 2000;

            if (direction === 'top') {
                // Berechne die Differenz, falls der Charakter über dem Hindernis schwebt
                const imageOffset = 82; // Passe diesen Wert an die Höhe des Bildes an
                other.y = this.collider.y - other.collider.height + imageOffset;
                if(!this.isPlayerAdjacent(other)) other.land(); // Charakter landet
            } else {
                this.isPlayerCollisionFromSide(other, direction);
            }

            if (currentTime - this.lastDamageTime >= this.damageCooldown) {
                other.takeDamage(); // Charakter nimmt Schaden
                this.lastDamageTime = currentTime;
            }
        }
    }





    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
