import { AttackState } from "./attackState.class.js";
import { WalkState } from "./walkState.class.js";

export class IdleState {
    constructor(boss) {
        this.boss = boss;
        this.calculateReturnPosition();
    }

    onEnter() {
        this.boss.setState('idle');
        this.idleTimer = 0; // Start the idle timer
    }

    calculateReturnPosition() {
        // Calculate a dynamic return position relative to the player’s position
        const offsetDistance = 120; // Minimum distance in pixels from the player
        this.returnPosition = this.boss.player.x < this.boss.x 
            ? this.boss.player.x + offsetDistance
            : this.boss.player.x - offsetDistance;
    }

    onUpdate(deltaTime) {
        this.idleTimer += deltaTime;
        const direction = (this.boss.x < this.boss.player.x) ? -1 : 1;
        const distanceToPlayer = this.boss.x - this.boss.player.x;

    // This gives the distance as an absolute value
        const distance = Math.abs(distanceToPlayer);        
        
        // Transition to WalkState when the player is within range, regardless of direction
        if (direction > 0 && distance < this.boss.playerInAttackDistance - 50) {
            this.boss.stateMachine.changeState(new WalkState(this.boss));            
        }
        else if(direction < 0 && distance < this.boss.playerInAttackDistance + 250) {            
            this.boss.stateMachine.changeState(new WalkState(this.boss));
        } 
        else if (this.idleTimer > 2) {
            // If the player isn't within range after 2 seconds, reset the idle timer
            this.idleTimer = 0;
        }
    }

    onExit() {
        this.idleTimer = 0;
    }
}
