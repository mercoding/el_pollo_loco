import { ReturnState } from "./returnState.class.js";

export class AttackState {
    constructor(boss) {
        this.boss = boss;
        this.attackTriggered = false;
    }

    onEnter() {
        this.boss.setState('attack');
        this.attackTriggered = false;
    }

    onUpdate(deltaTime) {
        if (!this.attackTriggered) {
            // Springbewegung
            this.boss.velocity.y = -400;  // Leichter Sprung
            const directionToPlayer = this.boss.player.x <= this.boss.x ? -1 : 1;
            this.boss.velocity.x = directionToPlayer * this.boss.speed * 2.5;  // Beschleunigte Bewegung auf Spieler zu
            this.attackTriggered = true;
            this.boss.onGround = false;            
        } 
        else if (this.boss.onGround) {
            // Wechsel in den Rückkehr-Status, nachdem der Angriff durchgeführt wurde
            this.boss.stateMachine.changeState(new ReturnState(this.boss));
            //this.boss.velocity.x = 0;
        }
    }

    onExit() {
        this.boss.velocity.x = 0;
        this.boss.velocity.y = 0;
        this.attackTriggered = false;
    }
}
