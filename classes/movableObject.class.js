import { CollisionCapable, GameObject } from "./gameObject.class.js";

export class MovableObject extends CollisionCapable(GameObject) {
    constructor(collisionManager, ...args) {
        super(collisionManager, ...args);
        this.velocity = { x: 0, y: 0 }; // Geschwindigkeit in x- und y-Richtung
        this.speed = 100;
        this.moveSimulation = false;
        this.target = null; // Ziel für Gegner

        this.layers = [
            { y: 0, range: [[0, 500], [1000, 1500]] }, // Ground level
            { y: 10, range: [[500, 1000]] }, // Elevated platform from x=500 to x=1000
            // Add more layers as needed
        ];
    }

    move(deltaTime, onTarget = false) {
        //if(this.moveSimulation) return;
        // Berechnung der neuen Position basierend auf der Geschwindigkeit und deltaTime
       
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        if(onTarget === true)  this.targetMove();

        // Collider nach der Bewegung aktualisieren
        this.updateCollider();
    }

    setVelocity(dx, dy) {
        //if(this.moveSimulation) return;
        this.velocity.x = dx * this.speed;
        this.velocity.y = dy * this.speed;
    }

    Translate(dx, dy, speed) {
        //if(this.moveSimulation) return;
        this.velocity.x = dx * speed;
        this.velocity.y = dy * speed;
    }

    setTarget(target) {
        this.target = target;  // Einmaliges Ziel für Bewegung setzen
    }


    targetMove() {
        let direction = 0;
        if (this.target !== null) {
            direction = this.target.x > this.x ? 1 : -1;  // Richtung festlegen
            this.velocity.x = this.speed * direction;  // Geschwindigkeit basierend auf Richtung            
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

export const Animatable = (Base) => class extends Base {
    constructor(animationPaths, collisionManager, ...args) {
        super(collisionManager, ...args);
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
