import { IdleState } from "./AI/idleState.class.js";
import { StateMachine } from "./AI/stateMachine.class.js";
import { AudioManager } from "./AudioManager.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class ChickenBoss extends Animatable(MovableObject) {
    global;
    healthStatusBar = new Image();
    healthStatus = {
        0: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue0.png' },
        20: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue20.png' },
        40: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue40.png' },
        60: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue60.png' },
        80: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue80.png' },
        100: { path: 'img/7_statusbars/2_statusbar_endboss/blue/blue100.png' }
    };
    constructor(animationPaths, collisionManager, player, x, ...args) {
        super(animationPaths, collisionManager, x, ...args);
        this.facingRight = true;
        this.setState('idle');
        this.speed = 50;
        this.gravity = 800;
        this.ground = 435;
        this.onGround = true;
        //this.canvas = canvas;
        this.player = player;
        this.dead = false;
        this.attackDistanceThreshold = 170;
        this.playerInAttackDistance = 300;
        this.targetPosition = 0;
        this.returning = false;
        this.attackTriggered = false;
        this.attackAnimationComplete = false;
        this.frameDuration = 0.3;
        this.startPosition = x;
        this.currentDistanceToPlayer;
        this.stateMachine = new StateMachine(new IdleState(this));
        this.updateCollider();
        this.health = 100;
        this.hitCount = 0;
        this.audioManager = new AudioManager();
        this.audioManager.effectsVolume = 0.2;
        this.soundRepeatCounter = 0;
        this.soundIndex = 0;
        this.soundCooldown = 0;
        this.cooldownDuration = 0.5;
        this.soundRepeatCounter = 0;
        //this.collider.height = 500;
        //this.collider.width = 500;
        //this.collider.y += 100;
        this.Start();
    }

    Start() {
        this.audioManager.loadSound('Bot1', 'audio/Bot12.wav');
        this.audioManager.loadSound('Bot2', 'audio/Bot11.wav');
        this.audioManager.loadSound('BotAttack', 'audio/Bakaa11.wav');
    }

    Update(ctx, deltaTime, screenX) {
        this.isOnGround(deltaTime);
        this.facingRight = this.player.x < this.x;
        this.currentDistanceToPlayer = this.calculateDistanceToPlayer();
        this.stateMachine.update(deltaTime);
        this.drawChicken(ctx, screenX);

        this.drawHealthBar(ctx, this.calculateBottlePercentage(this.hitCount), screenX + this.width / 2 - 100, this.y - 20);
        if (this.global.pause) return;
        this.updateAnimation(deltaTime);
        if (this.health <= 0) {
            this.setState('dead');
            return;
        }
        if (this.soundCooldown > 0) {
            this.soundCooldown -= deltaTime;
        }

        // Spiele Sounds, wenn Chicken läuft
        if (this.velocity.x !== 0 && this.soundCooldown <= 0) {
            this.playWalkingSound();
            this.soundCooldown = this.cooldownDuration; // Setze den Cooldown zurück
        }

        this.move(deltaTime);
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
            sound = 'Bot1';
            this.soundRepeatCounter++;
        } else {
            // Wechsel zum zweiten Sound
            sound = 'Bot2';
            this.soundRepeatCounter = 0; // Zurücksetzen für den nächsten Zyklus
        }

        this.audioManager.playSound(sound);
    }


    drawHealthBar(ctx, percent, x, y) {
        this.healthStatusBar.src = percent > 0 ? this.healthStatus[percent].path : this.healthStatus['0'].path;
        ctx.drawImage(this.healthStatusBar, x, y, 200, 50);
    }

    calculateBottlePercentage(hitCount) {
        // Maximalanzahl der Flaschen
        const maxHealth = 10;

        // Berechne den Prozentsatz der aktuellen Flaschenanzahl
        const percentage = (hitCount / maxHealth) * 100;

        // Runde auf den nächsten Schritt herunter, der in der UI-Anzeige verfügbar ist
        if (percentage >= 100) return 100;
        if (percentage >= 80) return 80;
        if (percentage >= 60) return 60;
        if (percentage >= 40) return 40;
        if (percentage >= 20) return 20;
        return 0;
    }

    moveLeft(frame, ctx, screenX) {
        ctx.translate(screenX + this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    moveRight(frame, ctx, screenX) {
        ctx.translate(screenX, this.y);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    calculateDistanceToPlayer() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    move(deltaTime) {
        super.move(deltaTime);
    }

    isOnGround(deltaTime) {
        if (!this.onGround) {
            this.velocity.y += this.gravity * deltaTime; // Gravitationskraft addieren
        }
        // Bodenüberprüfung und Landen
        if (this.y + this.height >= this.ground) { // Bodenhöhe hier auf `400` festgelegt
            this.y = this.ground - this.height; // Charakter auf dem Boden halten
            this.land(); // Charakter landet und Animation wird zurückgesetzt
        }
    }

    land() {
        this.onGround = true;
        this.velocity.y = 0;
        if (this.state == 'jump') this.setState('idle');
    }



    calculateReturnPosition(boss) {
        // Define the offset distance you want the boss to maintain from the player
        const offsetDistance = (this.player.x < boss.x) ? 250 : -250;

        // Determine the boss's target return position based on the player's position
        if (this.player.x < boss.x) {
            // If the player is to the left, position the boss to the right of the player
            return this.player.x + offsetDistance;
        } else {
            // If the player is to the right, position the boss to the left of the player
            return this.player.x - offsetDistance;
        }
    }
   

    onHit(other) {
        if (this.dead) return;
        //if (!this.dead) {
        if (this.health > 0) {
            this.hitCount += 2;
            this.health -= 20;

        }
        else {
            this.global.bossDefeated++;
            this.setState('dead');
            this.stateMachine.changeState('dead');
            this.dead = true;
        }
        //}
    }

    onCollisionEnter(other) {
        if (other.tag === "Player" && this.health > 0) {
            setTimeout(() => {
                other.takeDamage();
            }, 800);
        }
    }


}
