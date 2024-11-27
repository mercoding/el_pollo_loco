import { AudioManager } from "./AudioManager.class.js";
import { Character } from "./character.class.js";
import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Coin extends CollisionCapable(GameObject) {
    global;
    static coinImage = new Image();
    static imageLoaded = false;

    constructor(collisionManager, points, ...args) {
        super(collisionManager, ...args);
        this.dead = false;
        this.points = points;
        this.player = null;

        // Nur einmal das Bild für alle Coins laden
        if (!Coin.imageLoaded) {
            Coin.coinImage.src = 'img/coin/coin_1.png';
            Coin.imageLoaded = true;
        }
        //this.global.audioManager.loadSound('Coin', 'audio/Coins_Single_01.wav');
        this.updateCollider();
        //this.Start();
    }

    Start() {
        //this.global.audioManager.loadSound('Coin', 'audio/Coins_Single_01.wav');
    }

    Update(ctx, deltaTime, screenX) {
        if (!this.dead && this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(Coin.coinImage, screenX, this.y, this.width, this.height);

        }

        this.onCollisionStay();
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
            
            if (this.y > 290) {
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
