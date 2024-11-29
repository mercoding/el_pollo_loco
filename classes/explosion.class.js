import { AudioManager } from "./AudioManager.class.js";
import { GameObject } from "./gameObject.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class Explosion extends Animatable(MovableObject) {
    constructor(bottleExplodeAnimations, collisionManager, global, x, y, radius, tag = 'Explosion') {
        super(bottleExplodeAnimations, collisionManager, x, y, radius * 2, radius * 2, tag);
        this.global = global;
        this.radius = radius;
        this.timer = 0; // Zeit, wie lange die Explosion sichtbar bleibt
        this.duration = 0.5; // 0.5 Sekunden
        this.state = 'explode';
        //this.audioManager = new AudioManager();
        //this.audioManager.loadSound('Explosion', 'audio/GGGrasslands - Box Destroy.wav');
        this.global.audioManager.currentTime = 0;
        this.global.audioManager.playSound('Explosion'); 
        this.play = false;
        
    }

    Update(ctx, deltaTime, screenX) {
        this.timer += deltaTime;
        
        
        if (this.timer >= this.duration) {
            this.global.destroy(this);
            this.global.collisionManager.destroy(this);
            return;
        }

        // Zeichne die Explosion
        this.drawSplash(ctx, screenX);
    }

    drawSplash(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            ctx.translate(screenX, this.y);
            ctx.scale(1, 1);
            ctx.drawImage(frame, -5, -5, this.width, this.height);
            ctx.restore();
        }
        
        //console.log('explode');
    }
/*
    playSound() {
        if(!this.play) {
            //this.audioManager.loadSound('Explosion', 'audio/GGGrasslands - Box Destroy.wav');
            // Explosionseffekt (visuell und mechanisch)
            this.audioManager.currentTime = 0;
            this.audioManager.playSound('Explosion'); 
            this.play = true;
        }
    }

    onCollisionEnter(other) {
        if(obj.tag === 'Enemy') {
            console.log('hit');
        }
        this.playSound();
        console.log('explode');
        this.global.destroy(this);
        this.global.collisionManager.destroy(this);
        
    }*/
}
