import { ReturnState } from "./returnState.class.js";

/**
 * State attack
 *
 * @export
 * @class AttackState
 * @typedef {AttackState}
 */
export class AttackState {
    constructor(boss) {
        this.boss = boss;
        this.attackTriggered = false;
    }

    /** Set settings on start */
    onEnter() {
        if(this.boss.health <= 0) return;
        this.boss.setState('attack');
        this.attackTriggered = false;
        this.boss.audioManager.playSound('BotAttack');
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        if(this.boss.health <= 0) return;
        if (!this.attackTriggered) {
            this.boss.velocity.y = -400;  // Leichter Sprung
            const directionToPlayer = this.boss.player.x <= this.boss.x ? -1 : 1;
            const strength = directionToPlayer < 0 ? 3.5 : 5.5
            this.boss.velocity.x = directionToPlayer * this.boss.speed * strength;  // Beschleunigte Bewegung auf Spieler zu
            this.attackTriggered = true;
            this.boss.onGround = false;            
        } 
        else if (this.boss.onGround) {
            this.boss.stateMachine.changeState(new ReturnState(this.boss));
        }
    }

    /** Set settings on exit */
    onExit() {
        this.boss.velocity.x = 0;
        this.boss.velocity.y = 0;
        this.attackTriggered = false;
    }
}
