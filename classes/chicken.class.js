import { pepeAnimations } from "../animations/character.anim.js";
import { Character } from "./character.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class Chicken extends Animatable(MovableObject) {
    global;
    constructor(x, y, width, height, animationPaths) {
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.setState('walk');
        this.speed = 50;
        this.onGround = true;
        //this.gravity = 800;
        this.initialX = x;  // Speichere den Startpunkt
        //this.targetX = null; // Ziel für Gegner
        this.player = null;
        this.dead = false;
    }

    Start() { }

    Update(ctx, deltaTime, screenX) {
        // Update der Animation
        this.updateAnimation(deltaTime);

        // Falls es der Charakter ist, bleibt er in der Mitte
        if (this.isCollidingWith(this.player)) {
            this.checkCollisionWithPlayer();
        }
        this.drawChicken(ctx, screenX)
    }

    drawChicken(ctx, screenX) {
        // Frame für das aktuelle Bild der Animation erhalten
        const frame = this.getCurrentFrame();
        if (frame) {
            ctx.save();
            if (!this.facingRight) this.moveLeft(frame, ctx, screenX);
            else this.moveRight(frame, ctx, screenX);
            ctx.restore();
        }
    }

    moveLeft(frame, ctx, screenX) {
        ctx.translate(screenX + this.width, 380);
        ctx.scale(-1, 1);  // Flipped für "nach links"
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    moveRight(frame, ctx, screenX) {
        ctx.translate(screenX, 380);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }


    squish() {
        if (!this.isSquished) {
            //this.global.points += 10;
            this.y += 13;//+= this.height;  // Y-Position anpassen
            this.isSquished = true; // Gegner als zerquetscht markieren
            this.velocity.x = 0;
            this.setState('dead');
            this.global += 10;
        }
    }

    onHit(charHitbox, enemyHitbox) {
        const isFalling = this.player.velocity.y > 0;
        const hitsTopOfEnemy = charHitbox.bottom <= enemyHitbox.top + this.player.velocity.y;

        if (isFalling && hitsTopOfEnemy) {
            this.squish();
            this.player.velocity.y = -200;  // Setzt den „Bounce“-Effekt nach oben
            this.dead = true;
            return true;
        }
        this.player.takeDamage();
        return false;
    }

    checkCollisionWithPlayer() {
        if (this.dead || this.player.health < 1 || this.player.isHurt) return;
        const charHitbox = this.player.getHitbox();
        const enemyHitbox = this.getHitbox();

        // 1. Prüfe auf Überlappung zwischen Charakter und Gegner
        const isOverlappingHorizontally = charHitbox.right > enemyHitbox.left && charHitbox.left < enemyHitbox.right;
        const isOverlappingVertically = charHitbox.bottom > enemyHitbox.top && charHitbox.top < enemyHitbox.bottom;

        if (isOverlappingHorizontally && isOverlappingVertically) {
            this.onHit(charHitbox, enemyHitbox);
        }
        return false;
    }

    handleCollisionWithObstacle(obstacle) {
        const obstacleHitbox = obstacle.getHitbox();
        const chickenHitbox = this.getHitbox();

        // Check for collision overlap between enemy and obstacle
        const isOverlappingHorizontally = obstacleHitbox.right > chickenHitbox.left && obstacleHitbox.left < chickenHitbox.right;
        const isOverlappingVertically = obstacleHitbox.bottom > chickenHitbox.top && obstacleHitbox.top < chickenHitbox.bottom;

        if (isOverlappingHorizontally && isOverlappingVertically) {
            // Reverse the enemy's direction upon collision
            this.velocity.x *= -1;
            this.facingRight = !this.facingRight;
        }
    }
}
