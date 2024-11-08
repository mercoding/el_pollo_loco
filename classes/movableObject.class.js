import { GameObject } from "./gameObject.class.js";

export class MovableObject extends GameObject {
    constructor(x, y, width, height, speed) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.velocity = { x: 0, y: 0 };
    }

    move(deltaTime) {
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
    }

    Translate(dx, dy, speed) {
        this.speed = speed;
        this.velocity.x = dx * this.speed;
        this.velocity.y = dy * this.speed;
    }
}

export const Animatable = (Base) => class extends Base {
    constructor(animationPaths, ...args) {
        super(...args);
        this.state = 'idle';
        this.animations = {};
        for(const [state, pathInfo] of Object.entries(animationPaths)) {
            this.animations[state] = this.loadFrames(pathInfo.path, pathInfo.frameCount);
        }
        this.currentFrame = 0;
        this.frameDuration = 0.1;
        this.frameTime = 0;
    }

    loadFrames(path, frameCount) {
        const frames = [];
        let folders = path.split('/');        
        let indicator = folders[folders.length-1].charAt(0).toUpperCase();
        for (let index = 1; index <= frameCount; index++) {
            const img = new Image();
            img.src = `${path}/${indicator}-${index}.png`;
            frames.push(img);            
        }
        return frames;
    }

    updateAnimation(deltaTime) {
        this.frameTime += deltaTime;
        if(this.frameTime >= this.frameDuration) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.animations[this.state].length;
        }
    }

    setState(newState) {
        if(this.state !== newState) {
            this.state = newState;
            this.currentFrame = 0;
            this.frameTime = 0;
        }
    }

    getCurrentFrame() {
        return this.animations[this.state][Math.floor(this.currentFrame)];
    }
}