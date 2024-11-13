import { GameObject } from "./gameObject.class.js";

export class Coin extends GameObject {
    global;
    static coinImage = new Image();
    static imageLoaded = false;

    constructor(x, y, width, height, points) {
        super(x, y, width, height);
        this.dead = false;
        this.points = points;
        this.player = null;
        this.collider.width -= 30;
        this.collider.height -= 30;
        console.log(this.y);
        

        // Nur einmal das Bild für alle Coins laden
        if (!Coin.imageLoaded) {
            Coin.coinImage.src = 'img/8_coin/coin_1.png';
            Coin.imageLoaded = true;
        }        
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        // Zeichne die Münze, wenn sie noch nicht eingesammelt wurde und im sichtbaren Bereich ist
        if (!this.dead && this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(Coin.coinImage, screenX, this.y, this.width, this.height);
        }

        if (this.isCollidingWith(this.player)) {
            this.checkCollisionWithPlayer();
        }
    }

    checkCollisionWithPlayer() {        
        if (this.dead) return;

        const charHitbox = this.player.getHitbox();
        const coinHitbox = this.getHitbox();

        // Prüfe auf Überlappung zwischen Spieler und Münze
        const isOverlappingHorizontally = charHitbox.right > coinHitbox.left && charHitbox.left < coinHitbox.right;
        const isOverlappingVertically = charHitbox.bottom > coinHitbox.top && charHitbox.top < coinHitbox.bottom;

        if (isOverlappingHorizontally || isOverlappingVertically) {
            if(this.y > 290) {
                this.dead = true;
                this.global.coins += this.points;// Punkte zum Spieler hinzufügen
            }
            else if(!this.player.onGround) {
                this.dead = true;
                this.global.coins += this.points;// Punkte zum Spieler hinzufügen
            }
            console.log(this.global.coins);
            
        }
    }

    // Prüfen, ob Coin im sichtbaren Bereich des Canvas ist
    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
