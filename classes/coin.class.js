import { AudioManager } from "./AudioManager.class.js";
import { CollisionCapable, GameObject } from "./gameObject.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class Coin extends Animatable(CollisionCapable(GameObject)) {
    global;
    static coinImage = new Image();
    static imageLoaded = false;

    constructor(animationPaths, collisionManager, points, ...args) {
        super(animationPaths, collisionManager, ...args);
        this.dead = false;
        this.points = points;
        this.player = null;
        this.setState('idle');        
        this.updateCollider();
    }

    Start() {
        //this.global.audioManager.loadSound('Coin', 'audio/Coins_Single_01.wav');
    }

    Update(ctx, deltaTime, screenX) {
        this.drawCoin(ctx, screenX);
        this.updateAnimation(deltaTime);
        this.onCollisionStay();
        this.updateCollider();
    }

    drawCoin(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            ctx.translate(screenX, this.y);
            ctx.scale(1, 1);
            ctx.drawImage(frame, -15, -15, this.width + 30, this.height + 30);
            ctx.restore();
        }
    }

    // Prüfen, ob Coin im sichtbaren Bereich des Canvas ist
    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }

    onCollisionStay() {
        if (this.collidingWith == null) return;
        if (this.collidingWith.tag === "Player" && !this.collidingWith.onGround) {
            this.destroyCoin();
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

    onCollisionEnter(other) {
        if (other.tag == 'Player') {
            
            if (this.y >= other.y + other.height / 2 - 100) {
                setTimeout(() => {
                    this.destroyCoin();
                }, 150); 
            }
        }
    }

    destroyCoin() {
        if (this.collisionManager && !this.dead) {
            this.dead = true;
            this.global.coins += this.points;
            this.collidingWith = null;
            this.collisionManager.destroy(this);
            this.global.destroy(this);
            this.global.audioManager.loadSound('Coin', 'audio/Coins_Single_01.wav');
            this.global.audioManager.playSound('Coin');
        }
    }
}
