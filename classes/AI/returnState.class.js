import { IdleState } from "./idleState.class.js";

/**
 * Return state endboss walk back after attack
 *
 * @export
 * @class ReturnState
 * @typedef {ReturnState}
 */
export class ReturnState {
    constructor(boss) {
        this.boss = boss;
        this.targetReturnPosition = this.boss.calculateReturnPosition(boss);
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
        const distance = Math.abs(this.targetReturnPosition);
        const direction =  Math.abs(this.boss.x) >= this.targetReturnPosition ? -1 : 1;     
        const distanceToReturnPosition = Math.abs(this.boss.x - this.targetReturnPosition);        
        if (direction > 0 && distanceToReturnPosition <= 50 || direction < 0 && distanceToReturnPosition >= 750) {  // Adjusted threshold to 5 pixels
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        } else {
            this.boss.velocity.x = direction * this.boss.speed;
            this.boss.facingRight = direction > 0;            
        }
    }

    /** Set settings on exit */
    onExit() {
        this.boss.velocity.x = 0;
    }
}
