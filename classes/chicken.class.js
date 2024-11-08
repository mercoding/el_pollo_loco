import { Animatable, MovableObject } from "./movableObject.class.js";

export class Chicken extends Animatable(MovableObject) {
    constructor(x, y, width, height, animationPaths) {        
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.setState('walk');
    }

    Start() {}

    Update(ctx, deltaTime) {
        this.move(deltaTime);
        this.updateAnimation(deltaTime);
        const frame = this.getCurrentFrame();
        if(frame) {
            ctx.save();
            if(!this.facingRight) this.moveLeft(frame, ctx); 
            else this.moveRight(frame, ctx);
            ctx.restore();
        }
    }

    moveLeft(frame, ctx) {
        ctx.translate(this.x + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -this.x, this.y, this.width, this.height);
    }

    moveRight(frame, ctx) {
        ctx.translate(this.x, this.y);
        ctx.drawImage(frame, this.x, this.y, this.width, this.height);
    }
}