import { AttackState } from "./attackState.class.js";
import { IdleState } from "./idleState.class.js";

export class WalkState {
    constructor(boss) {
        this.boss = boss;
    }

    onEnter() {
        this.boss.setState('walk');
    }

    onUpdate(deltaTime) {
        // Determine direction and set boss movement toward player
        const direction = this.boss.player.x < this.boss.x ? -1 : 1;
        this.boss.velocity.x = direction * this.boss.speed;

        // Calculate distance to player for state transitions
        const distanceToPlayer = this.boss.calculateDistanceToPlayer();   
        const distance = Math.abs(distanceToPlayer);             
        
        // Transition to AttackState if within attack threshold
        if (direction < 0 && distanceToPlayer <= this.boss.attackDistanceThreshold || direction > 0 && distanceToPlayer <= this.boss.attackDistanceThreshold + 240) {
            this.boss.stateMachine.changeState(new AttackState(this.boss));
        } 
        // Transition to IdleState if player is beyond attack distance
        else if (direction < 0 && distance > this.boss.playerInAttackDistance) {
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        }
        else if (direction > 0 && distance > this.boss.playerInAttackDistance + 250) {
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        }
    }

    onExit() {
        this.boss.velocity.x = 0;
    }
}
