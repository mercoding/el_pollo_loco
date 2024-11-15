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
        this.collider.width -= 30;
        this.collider.height -= 30;

        // Nur einmal das Bild für alle Coins laden
        if (!Coin.imageLoaded) {
            Coin.coinImage.src = 'img/8_coin/coin_1.png';
            Coin.imageLoaded = true;
        }
        this.updateCollider();
    }

    Start() { }

    Update(ctx, deltaTime, screenX) {
        // Zeichne die Münze, wenn sie noch nicht eingesammelt wurde und im sichtbaren Bereich ist
        //this.updateCollision(this.player);
        /*if (super.updateCollision(this.player)) {

            //this.checkCollisionWithPlayer();
            this.onCollisionEnter(this.player);
        }*/
        //this.global.collisionManager.updateCollisions();
        //this.global.collisionManager.updateCollisions();
        
        if (!this.dead && this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(Coin.coinImage, screenX, this.y, this.width, this.height);
        }
    }
/*
    checkCollisionWithPlayer() {
        //if (this.dead) return;        
        //if (this.collidingWith) {
            const charHitbox = this.player.getHitbox();
            const coinHitbox = this.getHitbox();

            // Prüfe auf Überlappung zwischen Spieler und Münze
            const isOverlappingHorizontally = charHitbox.right > coinHitbox.left && charHitbox.left < coinHitbox.right;
            const isOverlappingVertically = charHitbox.bottom > coinHitbox.top && charHitbox.top < coinHitbox.bottom;

            if (isOverlappingHorizontally || isOverlappingVertically) {
                if (this.y > 290) {
                    this.dead = true;
                    this.global.coins += this.points;// Punkte zum Spieler hinzufügen
                }
                else if (!this.player.onGround) {
                    this.dead = true;
                    this.global.coins += this.points;// Punkte zum Spieler hinzufügen
                }
            }

            if (this.collisionManager) {
                this.collidingWith = null;
                this.collisionManager.destroy(this);
                this.global.destroy(this);
            }
        //}

    }*/

    onCollisionEnter(other) {
        other.collidingWith = this;        
        if(other.tag == 'Player')
        {
            if (this.y > 290) {
                this.dead = true;
                this.global.coins += this.points;// Punkte zum Spieler hinzufügen
            }
            else if (!this.player.onGround) {
                this.dead = true;
                this.global.coins += this.points;// Punkte zum Spieler hinzufügen
            }
        }

        if (this.collisionManager) {
            this.collidingWith = null;
            this.collisionManager.destroy(this);
            this.global.destroy(this);
        }        
    }

    // Prüfen, ob Coin im sichtbaren Bereich des Canvas ist
    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
