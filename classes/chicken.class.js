import { bottleAnimations } from "../animations/bottle.anim.js";
import { pepeAnimations } from "../animations/character.anim.js";
import { AudioManager } from "./AudioManager.class.js";
import { Bottle } from "./bottle.class.js";
import { Character } from "./character.class.js";
import { CollectableItem } from "./collectableItem.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class Chicken extends Animatable(MovableObject) {
    squishAudio = new Audio('audio/GGGrasslands - Box Destroy.wav');
    constructor(animationPaths, collisionManager, global, x, y, ...args) {
        super(animationPaths, collisionManager, x, y, ...args);
        this.global = global;
        this.facingRight = true;
        this.setState('walk');
        this.speed = 50;
        this.dead = false;
        this.touched = false;
        this.invincibilityDuration = 2.0;
        this.lastDamageTime = 0;
        this.soundIndex = 0; // Index für den Soundwechsel
        this.soundCooldown = 0; // Verhindert zu schnelles Abspielen
        this.cooldownDuration = 0.5;
        this.soundRepeatCounter = 0;
        this.Start();
    }

    Start() {
        this.audioManager = new AudioManager();
        this.audioManager.effectsVolume = 0.2;
        this.audioManager.loadSound('Bot1', 'audio/Bot1.wav');
        this.audioManager.loadSound('Bot2', 'audio/Bot2.wav');
        this.audioManager.loadSound('Squish', 'audio/Bakaa4.wav');
    }

    Update(ctx, deltaTime, screenX) {
        this.drawChicken(ctx, screenX);
        if (this.dead) return;
        if (this.global.pause || this.global.gameOver) return;
        this.move(deltaTime, true);
        this.updateAnimation(deltaTime);

        if (this.soundCooldown > 0) {
            this.soundCooldown -= deltaTime;
        }

        // Spiele Sounds, wenn Chicken läuft
        if (this.velocity.x !== 0 && this.soundCooldown <= 0) {
            this.playWalkingSound();
            this.soundCooldown = this.cooldownDuration; // Setze den Cooldown zurück
        }
        this.updateCollider();
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

    playWalkingSound() {
        let sound;

        if (this.soundRepeatCounter < 3) {
            // Spiele den ersten Sound zweimal
            sound = 'Bot2';
            this.soundRepeatCounter++;
        } else {
            // Wechsel zum zweiten Sound
            sound = 'Bot1';
            this.soundRepeatCounter = 0; // Zurücksetzen für den nächsten Zyklus
        }

        this.audioManager.playSound(sound);
    }

    moveLeft(frame, ctx, screenX) {
        ctx.translate(screenX + this.width, this.y);
        ctx.scale(-1, 1);  // Flipped für "nach links"
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    moveRight(frame, ctx, screenX) {
        ctx.translate(screenX, this.y);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    setBounceAfterSquish(other) {
        //other.velocity.y = 0;
        if (other.tag === "Player") {
            //other.velocity.y = 200;   // Setzt den „Bounce“-Effekt nach oben
            setTimeout(() => { other.velocity.y = Math.min(other.velocity.y, -150); }, 100);
            setTimeout(() => { other.velocity.y = 100; }, 250);
        }
    }


    squish(other) {
        if (!this.isSquished) {
            this.y += 13;
            this.collider.y += 25;
            this.collider.height -= 30;
            this.setBounceAfterSquish(other);
            this.global.audioManager.playSound('Squish');
            this.isSquished = true; // Gegner als zerquetscht markieren
            this.velocity.x = 0;
            this.setState('dead');
            this.onDeath();
            this.dead = true;
            this.collidingWith = null;
            this.collisionManager.destroy(this);
        }
    }

    onHit(other) {
        if (this.dead) return;
        if (!this.dead) {
            this.global.audioManager.loadSound('Squish', 'audio/Bakaa4.wav');
            this.global.audioManager.playSound('Squish');
            this.global.audioManager.stopSound('Bot1');
            this.global.audioManager.stopSound('Bot2');
            this.squish(other);
            this.dead = true;
        }
    }

    ifCollisionOnObstacle(other) {
        if (other.tag === 'Obstacle' || other.tag === 'Cactus') {
            if (!this.touched) {
                this.velocity.x *= -1;
                this.facingRight = !this.facingRight;
                this.touched = true;
                setTimeout(() => {
                    this.touched = false;
                }, 2000);
            }
        }
    }

    ifCollisionOnPlayer(other) {
        if (other.tag === 'Player') {
            const direction = this.getCollisionDirection(other);
            if ((direction === 'left' || direction === 'right')) {
                if(!this.isPlayerAdjacent(other)) other.takeDamage();
            }
            if (direction === 'top' && other.velocity.y > 0) {
                other.setState('jump');
                this.onHit(other);
            }
        }
    }

    isPlayerAdjacent(other) {
        if(!other.onGround) return;
        const buffer = 22; // Spielraum
        return (
            other.x < this.x + this.width / 2 - buffer || // Charakter links vom Hindernis
            other.x > this.x + this.width / 2 + buffer   // Charakter rechts vom Hindernis
        );
    }


    onCollisionEnter(other) {
        if (this.dead) return;
        this.ifCollisionOnObstacle(other);
        this.ifCollisionOnPlayer(other);

        if (other.tag === 'Explosion') {
            other.onCollisionEnter(this);
        }
    }

    onDeath() {
        // Lasse Flaschen fallen, wenn das Chicken besiegt wurde
        const numBottles = Math.floor(Math.random(0, 10) * 10); // 1-2 Flaschen        
        if (numBottles > 3) return;
        const bottle = new CollectableItem("img/bottle/rotation/R-1.png", this.global.collisionManager, this.x, this.y - 50, 50, 60, 'Bottle');
        bottle.global = this.global;
        this.global.addGameObject(bottle);
        this.global.collisionManager.addObject(bottle);
    }

}
