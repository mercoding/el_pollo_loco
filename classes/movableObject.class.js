import { CollisionCapable, GameObject } from "./gameObject.class.js";

/**
 * Class if a game object is movable and collision capable
 *
 * @export
 * @class MovableObject
 * @typedef {MovableObject}
 * @extends {CollisionCapable(GameObject)}
 */
export class MovableObject extends CollisionCapable(GameObject) {
    constructor(collisionManager, ...args) {
        super(collisionManager, ...args);
        this.velocity = { x: 0, y: 0 }; 
        this.speed = 100;
        this.moveSimulation = false;
        this.target = null; 
    }

    /**
     * Handle object movement
     *
     * @param {*} deltaTime
     * @param {boolean} [onTarget=false]
     */
    move(deltaTime, onTarget = false) {       
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        if(onTarget === true)  this.targetMove();
        this.updateCollider();
    }

    /**
     * Set velocity
     *
     * @param {*} dx
     * @param {*} dy
     */
    setVelocity(dx, dy) {
        this.velocity.x = dx * this.speed;
        this.velocity.y = dy * this.speed;
    }

    /**
     * Translate game object
     *
     * @param {*} dx
     * @param {*} dy
     * @param {*} speed
     */
    Translate(dx, dy, speed) {
        this.velocity.x = dx * speed;
        this.velocity.y = dy * speed;
    }

    /**
     * Set target position 
     *
     * @param {*} target
     */
    setTarget(target) {
        this.target = target;  
    }


    /** Move object to target if target is set */
    targetMove() {
        let direction = 0;
        if (this.target !== null) {
            direction = this.target.x > this.x ? 1 : -1;  
            this.velocity.x = this.speed * direction;             
            if ((direction === -1 && this.x >= this.target.x)) {                
                this.target = null;
                direction = -1; 
            }
            else if ((direction === 1 && this.x <= this.target.x)) {
                this.target = null;
                direction = 1; 
            }
        }    
        this.velocity.y = 0;
    }
}

/**
 * If movable object has animtion
 *
 * @param {*} Base
 * @returns {typeof (Anonymous class)}
 */
export const Animatable = (Base) => class extends Base {
    constructor(animationPaths, collisionManager, ...args) {
        super(collisionManager, ...args);
        this.state = 'idle';
        this.animations = {};
        for(const [state, pathInfo] of Object.entries(animationPaths)) {
            this.animations[state] = this.loadFrames(pathInfo.path, pathInfo.frameCount);
        }
        this.currentFrame = 0;
        this.frameDuration = 0.1; 
        this.frameTime = 0;
    }

    /**
     * Load frames
     *
     * @param {*} path
     * @param {*} frameCount
     * @returns {{}}
     */
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

    /**
     * Update animation
     *
     * @param {*} deltaTime
     */
    updateAnimation(deltaTime) {
        this.frameTime += deltaTime;
        if(this.frameTime >= this.frameDuration) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.animations[this.state].length;
        }
    }

    /**
     * Set animation state -> idle, walk, jump...
     *
     * @param {*} newState
     */
    setState(newState) {
        if(this.state !== newState) {
            this.state = newState;
            this.currentFrame = 0;
            this.frameTime = 0;
        }
    }

    /**
     * Get current frame
     *
     * @returns {*}
     */
    getCurrentFrame() {
        if (this.animations[this.state]) {
            return this.animations[this.state][this.currentFrame];
        }
        return null;
    }
};
