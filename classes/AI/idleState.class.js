import { AttackState } from "./attackState.class.js";
import { WalkState } from "./walkState.class.js";

/**
 * Idle state
 *
 * @export
 * @class IdleState
 * @typedef {IdleState}
 */
export class IdleState {
    constructor(boss) {
        this.boss = boss;
        this.calculateReturnPosition();
    }

    /** Set settings on start */
    onEnter() {
        if(this.boss.health <= 0) return;
        this.boss.setState('idle');
        this.idleTimer = 0; // Start the idle timer
    }

    /** Calculate return positions */
    calculateReturnPosition() {
        // Calculate a dynamic return position relative to the player’s position
        const offsetDistance = 200; // Minimum distance in pixels from the player
        this.returnPosition = this.boss.player.x < this.boss.x 
            ? this.boss.player.x + offsetDistance
            : this.boss.player.x - offsetDistance;
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        if(this.boss.health <= 0) return;
        this.idleTimer += deltaTime;
        const direction = (this.boss.x <= this.boss.player.x) ? -1 : 1;
        const distanceToPlayer = this.boss.x - this.boss.player.x;
        const distance = Math.abs(distanceToPlayer);        
        if (direction > 0 && distance <= this.boss.playerInAttackDistance - 50) {
            this.boss.stateMachine.changeState(new WalkState(this.boss));            
        }
        else if(direction < 0 && distance <= this.boss.playerInAttackDistance + 250) {            
            this.boss.stateMachine.changeState(new WalkState(this.boss));
        } 
        else if (this.idleTimer > 2) {
            this.idleTimer = 0;
        }
    }

    /** Set settings on exit */
    onExit() {
        this.idleTimer = 0;
    }
}
