import { GameObject } from "./gameObject.class.js";

export class MovableObject extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.velocity = { x: 0, y: 0 }; // Geschwindigkeit in x- und y-Richtung
        this.speed = 100;
        this.moveSimulation = false;
    }

    move(deltaTime) {
        if(this.moveSimulation) return;
        // Berechnung der neuen Position basierend auf der Geschwindigkeit und deltaTime
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;

        // Collider nach der Bewegung aktualisieren
        this.updateCollider();
    }

    setVelocity(dx, dy) {
        if(this.moveSimulation) return;
        this.velocity.x = dx * this.speed;
        this.velocity.y = dy * this.speed;
    }

    Translate(dx, dy, speed) {
        if(this.moveSimulation) return;
        this.velocity.x = dx * speed;
        this.velocity.y = dy * speed;
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
        this.frameDuration = 0.1; // Dauer jedes Frames in Sekunden
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
        // Frame-Zeit hochzählen
        this.frameTime += deltaTime;

        // Frame wechseln, wenn die Dauer überschritten ist
        if(this.frameTime >= this.frameDuration) {
            this.frameTime = 0;
            this.currentFrame = (this.currentFrame + 1) % this.animations[this.state].length;
        }
    }

    setState(newState) {
        // Überprüfen, ob der Zustand sich ändert, um Animationen neu zu starten
        if(this.state !== newState) {
            this.state = newState;
            this.currentFrame = 0;
            this.frameTime = 0;
        }
    }

    getCurrentFrame() {
        // Sicherheitscheck: Existiert Animation für den Zustand?
        if (this.animations[this.state]) {
            return this.animations[this.state][this.currentFrame];
        }
        return null;
    }
};
