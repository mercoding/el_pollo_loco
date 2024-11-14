import { IdleState } from "./idleState.class.js";

export class ReturnState {
    constructor(boss) {
        this.boss = boss;
        this.targetReturnPosition = this.boss.calculateReturnPosition(boss);
    }

    onEnter() {
        this.boss.setState('walk');
    }

    onUpdate(deltaTime) {
        const distance = Math.abs(this.targetReturnPosition);
        const direction =  Math.abs(this.boss.x) >= this.targetReturnPosition ? -1 : 1;     
        const distanceToReturnPosition = Math.abs(this.boss.x - this.targetReturnPosition);
        
        // Set a small threshold to ensure the boss reaches the exact target position
        if (direction > 0 && distanceToReturnPosition <= 50 || direction < 0 && distanceToReturnPosition >= 750) {  // Adjusted threshold to 5 pixels
            this.boss.stateMachine.changeState(new IdleState(this.boss));
        } else {
            // Move towards the target return position
            this.boss.velocity.x = direction * this.boss.speed;
            this.boss.facingRight = direction > 0;            
        }
    }

    onExit() {
        this.boss.velocity.x = 0;
    }
}
