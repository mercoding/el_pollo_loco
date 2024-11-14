import { IdleState } from "./AI/idleState.class.js";
import { StateMachine } from "./AI/stateMachine.class.js";
import { Animatable, MovableObject } from "./movableObject.class.js";

export class ChickenBoss extends Animatable(MovableObject) {
    global;
    constructor(player, x, y, width, height, canvas, animationPaths) {
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.setState('idle');
        this.speed = 50;
        this.gravity = 800; 
        this.ground = 435;
        this.onGround = true;
        this.canvas = canvas;
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
    }

    Start() {}

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

    /*
    calculateReturnPosition() {
        // Berechnet eine dynamische Rückkehrposition relativ zur Position des Spielers
        const offsetDistance = 250; // Mindestabstand in Pixeln zur Spielerposition
        this.returnPosition = this.boss.player.x < this.boss.x 
            ? this.boss.player.x + offsetDistance
            : this.boss.player.x - offsetDistance;
    }*/

            calculateReturnPosition() {
                // Define the minimum offset distance from the player
                const offsetDistance = 250; 
                
                // Calculate the return position based on the boss’s and player’s current positions
                if (this.boss.x < this.boss.player.x) {
                    console.log(this.boss.player.x - offsetDistance);
                    // Boss is to the left of the player, return to the left side at the offset distance
                    return this.boss.player.x - offsetDistance;
                } else {
                    console.log(this.boss.player.x + offsetDistance);
                    
                    // Boss is to the right of the player, return to the right side at the offset distance
                    return this.boss.player.x + offsetDistance;
                }
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
        //else if (this.keyPressed) this.setState('walk');
    }

    performAttackJump() {
        console.log('jump');
        this.setState('attack');
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const directionX = dx / distance;
        this.velocity.y = -200;  // Jump up
        this.velocity.x = directionX * 150;  // Move towards player
    }

    hasLandedAfterAttack() {
        return this.onGround;  // Placeholder for checking if boss has landed
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

    
}
