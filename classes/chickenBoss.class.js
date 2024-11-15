import { IdleState } from "./AI/idleState.class.js";
import { StateMachine } from "./AI/stateMachine.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class ChickenBoss extends Animatable(MovableObject) {
    global;
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
        this.attackDistanceThreshold = 120;
        this.playerInAttackDistance = 250;
        this.targetPosition = 0;
        this.returning = false;
        this.attackTriggered = false;
        this.attackAnimationComplete = false;
        this.frameDuration = 0.3;
        this.startPosition = x;
        this.currentDistanceToPlayer;
        this.stateMachine = new StateMachine(new IdleState(this));
        this.updateCollider();
        //this.collider.height = 500;
        //this.collider.width = 500;
        //this.collider.y += 100;
    }

    Start() { }

    Update(ctx, deltaTime, screenX) {
        this.isOnGround(deltaTime);
        //this.velocity.y = 0;

        this.updateAnimation(deltaTime);

        // Bestimmt die Blickrichtung des Bosses
        this.facingRight = this.player.x < this.x;
        this.currentDistanceToPlayer = this.calculateDistanceToPlayer();
        this.stateMachine.update(deltaTime);

        // Führe die Bewegung aus
        this.move(deltaTime);
        

        this.drawChicken(ctx, screenX);
        super.updateCollider();
        //this.updateCollision();
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
/*
    updateCollision() {
        //if(super.isCollidingWith(this.player)) console.log('colliding');
        if(super.collidingWith != null) console.log('colliding');
        
        /*
        const bossHitBox = this.getHitbox();
        const playerHitbox = this.player.getHitbox();
    
        // Horizontale und vertikale Überschneidung gleichzeitig prüfen
        const isOverlappingHorizontally = bossHitBox.right > playerHitbox.left && bossHitBox.left < playerHitbox.right;
        const isOverlappingVertically = bossHitBox.bottom > playerHitbox.top && bossHitBox.top < playerHitbox.bottom;
    
        if (isOverlappingHorizontally && isOverlappingVertically) {
            
            console.log("collision detected");
            return true;  // Es gibt eine Kollision
        }
        return false;  // Keine Kollision erkannt*/
    //}*/
    
    
    
    
    
}
