import { AttackState } from "./attackState.class.js";
import { IdleState } from "./idleState.class.js";

/**
 * Walk state
 *
 * @export
 * @class WalkState
 * @typedef {WalkState}
 */
export class WalkState {
    constructor(boss) {
        this.boss = boss;
    }

    /** Set settings on start */
    onEnter() {
        if(this.boss.health <= 0) return;
        this.boss.setState('walk');
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        if(this.boss.health <= 0) return;        
        const direction = this.boss.player.x <= this.boss.x ? -1 : 1;
        this.boss.velocity.x = direction * this.boss.speed;
        const distanceToPlayer = this.boss.calculateDistanceToPlayer();   
        const distance = Math.abs(distanceToPlayer);             
        if (direction < 0 && distanceToPlayer <= this.boss.attackDistanceThreshold || direction > 0 && distanceToPlayer <= this.boss.attackDistanceThreshold + 240) {
            this.boss.stateMachine.changeState(new AttackState(this.boss));
        } 
        else if (direction < 0 && distance >= this.boss.playerInAttackDistance) {
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        }
        else if (direction > 0 && distance >= this.boss.playerInAttackDistance + 250) {
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        }
    }

    /** Set settings on exit */
    onExit() {
        this.boss.velocity.x = 0;
    }
}
