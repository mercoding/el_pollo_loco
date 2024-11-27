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
    

    
    onCollisionEnter(other) {
        if(other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            //console.log(direction);
            if (direction === 'top') {
                //console.log(other);
                other.land();
            } else if (direction === 'left') {
                //console.log(other.velocity.x);
                
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
    }

    isCactus(other) {
        if(this.tag === "Cactus") {
            const distanceToPlayer = this.x - other.x;
            const distance = Math.abs(distanceToPlayer); 
            if(distance <= 20) {
                if (!this.isInvincible) {
                    other.takeDamage();
                    this.isInvincible = true;
                    setTimeout(() => { this.isInvincible = false; }, 2000);
                }
            }
            return true;
        }
        return false;
    }
    
    onCollisionExit(other) {
        /*if (other.tag === 'Player') {
            if((other.x >= this.x + 20  || other.x <= this.x - 20) && other.onGround && other.y <= this.y)
                other.velocity.y = 200;
        }*/
    }

    isTouchingTopOfCollider(character, other) {
        const charHitbox = character.getHitbox();
        const otherHitbox = other.getHitbox();
    
        return (
            charHitbox.bottom >= otherHitbox.top - 15 &&                 // Charakter berührt die Oberseite des Objekts
            charHitbox.bottom <= otherHitbox.top + 15 &&            // Ein kleiner Puffer, um nur von oben zu prüfen
            charHitbox.right > otherHitbox.left + 15 &&                 // Charakter ist horizontal im Bereich des Objekts
            charHitbox.left < otherHitbox.right - 15 &&                 // Charakter ist horizontal im Bereich des Objekts
            character.velocity.y >= 0                              // Charakter fällt nach unten
        );
    }
    


    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
