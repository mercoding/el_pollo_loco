import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class Ground extends CollisionCapable(GameObject) {
    global;
    constructor(collisionManager, ...args) {
        super(collisionManager, ...args);
        this.groundLevel = 430;
    }

    Start() {}

    Update(ctx, deltaTime, screenX) {
        this.ctx = ctx;
        deltaTime = deltaTime;
        // Only render the obstacle if it is visible on the canvas
        this.draw(ctx, screenX);
        this.updateCollider();
    }

    draw(ctx, screenX) {
        ctx.fillStyle = 'transparent'; //this.color;
        ctx.fillRect(screenX, this.y, this.width, this.height);
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

    updateCollider() {
        super.updateCollider();
    }

    onCollisionEnter(other) {
        if(other != null) {            
            other.ground = this.groundLevel;//this.y + this.height / 2;            
            if(typeof other.land === 'function') other.land();
        }
    }
}
