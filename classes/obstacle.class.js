import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Obstacle extends CollisionCapable(GameObject) {
    static obstacleImage = new Image();
    static imageLoaded = false;

    constructor(imgPath, collisionManager, ...args) {
        super(collisionManager, ...args);
        this.dead = false;

        // Load the obstacle image only once for performance
        if (!Obstacle.imageLoaded) {
            Obstacle.obstacleImage.src = imgPath;
            Obstacle.imageLoaded = true;
        }
        this.updateCollider();
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        // Only render the obstacle if it is visible on the canvas
        if (Obstacle.imageLoaded && this.isVisibleOnCanvas(screenX, ctx.canvas.width)) {
            ctx.drawImage(Obstacle.obstacleImage, screenX, this.y, this.width, this.height);
        }
    }

    handleCollisionWithEnemy(enemy) {
        const enemyHitbox = enemy.getHitbox();
        const obstacleHitbox = this.getHitbox();

        // Check for collision overlap between enemy and obstacle
        const isOverlappingHorizontally = enemyHitbox.right > obstacleHitbox.left && enemyHitbox.left < obstacleHitbox.right;
        const isOverlappingVertically = enemyHitbox.bottom > obstacleHitbox.top && enemyHitbox.top < obstacleHitbox.bottom;

        if (isOverlappingHorizontally && isOverlappingVertically) {
            // Reverse the enemy's direction upon collision
            enemy.velocity.x *= -1;
            enemy.facingRight = !enemy.facingRight;
        }
    }

    isVisibleOnCanvas(screenX, canvasWidth) {
        // Check if the obstacle is within the visible canvas area
        return screenX + this.width > 0 && screenX < canvasWidth;
    }
}
